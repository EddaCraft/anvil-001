import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GateRunner } from './gate-runner.js';
import { GateConfigManager } from './gate-config.js';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Gate Integration Tests', () => {
  let gateRunner: GateRunner;
  let configManager: GateConfigManager;
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), 'anvil-test', Math.random().toString(36));
    mkdirSync(tempDir, { recursive: true });

    gateRunner = new GateRunner();
    configManager = new GateConfigManager(tempDir);
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should run complete gate workflow', async () => {
    // Create a test plan
    const plan = {
      id: 'aps-test123',
      intent: 'Add TypeScript support',
      proposed_changes: [
        {
          type: 'file',
          target: 'src/index.ts',
          action: 'create',
          content: 'console.log("Hello, TypeScript!");',
        },
        {
          type: 'file',
          target: 'src/utils.ts',
          action: 'create',
          content: 'export function helper() { return "help"; }',
        },
      ],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };

    // Create the files referenced in the plan
    mkdirSync(join(tempDir, 'src'), { recursive: true });
    writeFileSync(join(tempDir, 'src', 'index.ts'), 'console.log("Hello, TypeScript!");');
    writeFileSync(join(tempDir, 'src', 'utils.ts'), 'export function helper() { return "help"; }');

    // Create a basic config
    const config = {
      version: 1,
      checks: [
        {
          name: 'secret',
          description: 'Secret scanning',
          enabled: true,
          config: {},
        },
      ],
      thresholds: {
        overall_score: 80,
      },
    };

    configManager.saveConfig(config);

    // Run the gate
    const result = await gateRunner.runGate(plan, config, tempDir);

    expect(result).toBeDefined();
    expect(result.overall).toBe(true);
    expect(result.checks).toHaveLength(1);
    expect(result.checks[0].check).toBe('secret');
    expect(result.checks[0].passed).toBe(true);
  });

  it('should handle mixed check results', async () => {
    const plan = {
      id: 'aps-test123',
      intent: 'Test plan with secrets',
      proposed_changes: [
        {
          type: 'file',
          target: 'src/secret.js',
          action: 'create',
          content: 'const apiKey = "sk-1234567890abcdef";',
        },
      ],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };

    mkdirSync(join(tempDir, 'src'), { recursive: true });
    writeFileSync(join(tempDir, 'src', 'secret.js'), 'const apiKey = "sk-1234567890abcdef";');

    const config = {
      version: 1,
      checks: [
        {
          name: 'secret',
          description: 'Secret scanning',
          enabled: true,
          config: {},
        },
      ],
      thresholds: {
        overall_score: 80,
      },
    };

    const result = await gateRunner.runGate(plan, config, tempDir);

    expect(result.overall).toBe(false);
    expect(result.checks[0].passed).toBe(false);
    expect(result.checks[0].details?.findings).toHaveLength(1);
  });

  it('should handle disabled checks', async () => {
    const plan = {
      id: 'aps-test123',
      intent: 'Test plan',
      proposed_changes: [],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };

    const config = {
      version: 1,
      checks: [
        {
          name: 'secret',
          description: 'Secret scanning',
          enabled: false,
          config: {},
        },
      ],
      thresholds: {
        overall_score: 80,
      },
    };

    const result = await gateRunner.runGate(plan, config, tempDir);

    expect(result.overall).toBe(true);
    expect(result.checks[0].skipped).toBe(true);
  });

  it('should calculate scores correctly with multiple checks', async () => {
    const plan = {
      id: 'aps-test123',
      intent: 'Test plan',
      proposed_changes: [
        {
          type: 'file',
          target: 'src/clean.js',
          action: 'create',
          content: 'console.log("clean code");',
        },
      ],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };

    mkdirSync(join(tempDir, 'src'), { recursive: true });
    writeFileSync(join(tempDir, 'src', 'clean.js'), 'console.log("clean code");');

    const config = {
      version: 1,
      checks: [
        {
          name: 'secret',
          description: 'Secret scanning',
          enabled: true,
          config: {},
        },
      ],
      thresholds: {
        overall_score: 50,
      },
    };

    const result = await gateRunner.runGate(plan, config, tempDir);

    expect(result.score).toBe(100);
    expect(result.overall).toBe(true);
  });
});
