import { BaseCheck } from '../check.interface.js';
import { CheckContext, GateResult } from '../../types/gate.types.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class SecretCheck extends BaseCheck {
  name = 'secret';
  description = 'Scan for potential secrets and sensitive data';

  private readonly secretPatterns = [
    // API Keys
    { name: 'API Key', pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/i },
    // JWT Tokens
    { name: 'JWT Token', pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/ },
    // AWS Keys
    { name: 'AWS Key', pattern: /AKIA[0-9A-Z]{16}/ },
    // Private Keys
    { name: 'Private Key', pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/ },
    // Database URLs
    { name: 'Database URL', pattern: /(?:postgres|mysql|mongodb):\/\/[^:\s]+:[^@\s]+@/ },
    // Generic secrets
    { name: 'Generic Secret', pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"]?[^\s'"]{8,}['"]?/i },
    // Credit Cards (basic pattern)
    { name: 'Credit Card', pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/ },
  ];

  async run(context: CheckContext): Promise<GateResult> {
    try {
      const files = this.getFilesFromPlan(context);
      const findings: Array<{
        file: string;
        line: number;
        type: string;
        match: string;
        context: string;
      }> = [];

      for (const file of files) {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf-8');
          const lines = content.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            
            for (const pattern of this.secretPatterns) {
              const matches = line.match(pattern.pattern);
              if (matches) {
                findings.push({
                  file: file.replace(context.workspace_root, ''),
                  line: lineNumber,
                  type: pattern.name,
                  match: matches[0],
                  context: line.trim()
                });
              }
            }
          }
        }
      }

      const passed = findings.length === 0;
      const message = passed
        ? 'No secrets detected'
        : `Found ${findings.length} potential secret(s)`;

      return this.createResult(
        passed,
        message,
        passed ? 100 : Math.max(0, 100 - findings.length * 10),
        { findings }
      );
    } catch (error) {
      return this.createFailure(
        'Secret scan failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private getFilesFromPlan(context: CheckContext): string[] {
    const files: string[] = [];
    
    for (const change of context.plan.proposed_changes) {
      if (change.type === 'file') {
        const fullPath = join(context.workspace_root, change.target);
        if (existsSync(fullPath)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }
}