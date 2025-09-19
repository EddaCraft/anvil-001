import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SecretCheck } from './secret.check.js';
import { CheckContext, PlanData } from '../../types/gate.types.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('SecretCheck', () => {
  let secretCheck: SecretCheck;
  let tempDir: string;
  let context: CheckContext;

  beforeEach(() => {
    secretCheck = new SecretCheck();
    tempDir = join(tmpdir(), 'anvil-test', Math.random().toString(36));
    mkdirSync(tempDir, { recursive: true });

    const mockPlan: PlanData = {
      id: 'aps-test123',
      intent: 'Test plan',
      proposed_changes: [
        {
          type: 'file',
          target: 'test.js',
          action: 'create',
          content: '',
        },
      ],
      provenance: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'test@example.com',
        version: '1.0.0',
      },
    };

    context = {
      plan: mockPlan,
      workspace_root: tempDir,
      config: {
        version: 1,
        checks: [],
        thresholds: { overall_score: 80 },
      },
      check_config: {},
    };
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should pass when no secrets are found', async () => {
    writeFileSync(join(tempDir, 'test.js'), 'console.log("hello world");');

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(true);
    expect(result.message).toBe('No secrets detected');
    expect(result.score).toBe(100);
  });

  it('should detect API keys', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      'const apiKey = "sk-1234567890abcdef1234567890abcdef";'
    );

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('API Key');
  });

  it('should detect JWT tokens', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      'const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";'
    );

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('JWT Token');
  });

  it('should detect AWS keys', async () => {
    writeFileSync(join(tempDir, 'test.js'), 'const awsKey = "AKIAIOSFODNN7EXAMPLE";');

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('AWS Key');
  });

  it('should detect private keys', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      'const privateKey = "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...";'
    );

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('Private Key');
  });

  it('should detect database URLs', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      'const dbUrl = "postgres://user:password@localhost:5432/mydb";'
    );

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('Database URL');
  });

  it('should detect generic secrets', async () => {
    writeFileSync(join(tempDir, 'test.js'), 'const secret = "my-super-secret-password-123";');

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(1);
    expect((result.details as any).findings[0].type).toBe('Generic Secret');
  });

  it('should provide file and line information', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      'console.log("line 1");\nconst apiKey = "sk-1234567890abcdef";\nconsole.log("line 3");'
    );

    const result = await secretCheck.run(context);

    expect((result.details as any).findings[0].line).toBe(2);
    expect((result.details as any).findings[0].file).toBe('/test.js');
  });

  it('should handle multiple secrets in one file', async () => {
    writeFileSync(
      join(tempDir, 'test.js'),
      `
      const apiKey = "sk-1234567890abcdef";
      const password = "my-secret-password";
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    `
    );

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(false);
    expect(result.details?.findings).toHaveLength(3);
  });

  it('should handle missing files gracefully', async () => {
    context.plan.proposed_changes[0].target = 'nonexistent.js';

    const result = await secretCheck.run(context);

    expect(result.passed).toBe(true);
    expect(result.details?.findings).toHaveLength(0);
  });
});
