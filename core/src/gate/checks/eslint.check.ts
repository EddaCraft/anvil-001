import { BaseCheck } from '../check.interface.js';
import { CheckContext, GateResult } from '../../types/gate.types.js';
import { ESLint } from 'eslint';
import { existsSync } from 'fs';
import { join } from 'path';

export class ESLintCheck extends BaseCheck {
  name = 'eslint';
  description = 'Run ESLint code quality checks';

  async run(context: CheckContext): Promise<GateResult> {
    try {
      const eslint = new ESLint({
        cwd: context.workspace_root,
      });

      // Get all relevant files from the plan
      const files = this.getFilesFromPlan(context);
      
      if (files.length === 0) {
        return this.createSuccess('No files to lint', 100);
      }

      const results = await eslint.lintFiles(files);
      
      const errorCount = results.reduce((acc, result) => acc + result.errorCount, 0);
      const warningCount = results.reduce((acc, result) => acc + result.warningCount, 0);
      const fixableCount = results.reduce((acc, result) => acc + result.fixableErrorCount + result.fixableWarningCount, 0);

      const totalIssues = errorCount + warningCount;
      const score = totalIssues === 0 ? 100 : Math.max(0, 100 - (errorCount * 10 + warningCount * 2));

      const passed = errorCount === 0 && score >= (context.check_config.min_score || 80);

      const message = passed
        ? `ESLint passed: ${errorCount} errors, ${warningCount} warnings`
        : `ESLint failed: ${errorCount} errors, ${warningCount} warnings`;

      return this.createResult(
        passed,
        message,
        score,
        {
          errorCount,
          warningCount,
          fixableCount,
          results: results.map(r => ({
            filePath: r.filePath,
            errorCount: r.errorCount,
            warningCount: r.warningCount,
            messages: r.messages
          }))
        }
      );
    } catch (error) {
      return this.createFailure(
        'ESLint check failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private getFilesFromPlan(context: CheckContext): string[] {
    const files: string[] = [];
    
    for (const change of context.plan.proposed_changes) {
      if (change.type === 'file' && this.isLintableFile(change.target)) {
        const fullPath = join(context.workspace_root, change.target);
        if (existsSync(fullPath)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  private isLintableFile(filePath: string): boolean {
    const lintableExtensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'];
    return lintableExtensions.some(ext => filePath.endsWith(ext));
  }
}