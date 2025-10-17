import { describe, it, expect, beforeEach } from 'vitest';
import { GateRunner } from './gate-runner.js';
import { GateConfig, PlanData } from '../types/gate.types.js';
import { BaseCheck } from './check.interface.js';

class MockCheck extends BaseCheck {
  name = 'mock';
  description = 'Mock check for testing';

  async run() {
    return this.createSuccess('Mock check passed', 100);
  }
}

class FailingMockCheck extends BaseCheck {
  name = 'failing-mock';
  description = 'Failing mock check for testing';

  async run() {
    return this.createFailure('Mock check failed');
  }
}

describe('GateRunner', () => {
  let gateRunner: GateRunner;
  let mockPlan: PlanData;
  let mockConfig: GateConfig;

  beforeEach(() => {
    gateRunner = new GateRunner();
    mockPlan = {
      id: 'aps-test123',
      intent: 'Test plan',
      proposed_changes: [
        {
          type: 'file',
          target: 'src/test.ts',
          action: 'create',
          content: 'console.log("test");',
        },
      ],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };
    mockConfig = {
      version: 1,
      checks: [
        {
          name: 'mock',
          description: 'Mock check',
          enabled: true,
          config: {},
        },
      ],
      thresholds: {
        overall_score: 80,
      },
    };
  });

  it('should register and run custom checks', async () => {
    const mockCheck = new MockCheck();
    gateRunner.registerCheck(mockCheck);

    const result = await gateRunner.runGate(mockPlan, mockConfig, '/workspace');

    expect(result.overall).toBe(true);
    expect(result.score).toBe(100);
    expect(result.checks).toHaveLength(1);
    expect(result.checks[0].check).toBe('mock');
    expect(result.checks[0].passed).toBe(true);
  });

  it('should handle failing checks', async () => {
    const failingCheck = new FailingMockCheck();
    gateRunner.registerCheck(failingCheck);

    mockConfig.checks = [
      {
        name: 'failing-mock',
        description: 'Failing mock check',
        enabled: true,
        config: {},
      },
    ];

    const result = await gateRunner.runGate(mockPlan, mockConfig, '/workspace');

    expect(result.overall).toBe(false);
    expect(result.checks[0].passed).toBe(false);
  });

  it('should skip disabled checks', async () => {
    mockConfig.checks = [
      {
        name: 'mock',
        description: 'Mock check',
        enabled: false,
        config: {},
      },
    ];

    const result = await gateRunner.runGate(mockPlan, mockConfig, '/workspace');

    expect(result.overall).toBe(true);
    expect(result.checks[0].skipped).toBe(true);
  });

  it('should handle unknown checks', async () => {
    mockConfig.checks = [
      {
        name: 'unknown-check',
        description: 'Unknown check',
        enabled: true,
        config: {},
      },
    ];

    const result = await gateRunner.runGate(mockPlan, mockConfig, '/workspace');

    expect(result.checks[0].passed).toBe(false);
    expect(result.checks[0].error).toBe('Unknown check');
  });

  it('should calculate overall score correctly', async () => {
    const check1 = new MockCheck();
    check1.name = 'check1';
    const check2 = new MockCheck();
    check2.name = 'check2';

    gateRunner.registerCheck(check1);
    gateRunner.registerCheck(check2);

    mockConfig.checks = [
      {
        name: 'check1',
        description: 'Check 1',
        enabled: true,
        config: {},
      },
      {
        name: 'check2',
        description: 'Check 2',
        enabled: true,
        config: {},
      },
    ];

    const result = await gateRunner.runGate(mockPlan, mockConfig, '/workspace');

    expect(result.score).toBe(100);
    expect(result.summary.total).toBe(2);
    expect(result.summary.passed).toBe(2);
  });

  it('should unregister checks', () => {
    const mockCheck = new MockCheck();
    gateRunner.registerCheck(mockCheck);

    expect(gateRunner.getAvailableChecks()).toContain('mock');

    gateRunner.unregisterCheck('mock');

    expect(gateRunner.getAvailableChecks()).not.toContain('mock');
  });
});
