import { BaseCheck } from '../check.interface.js';
import { CheckContext, GateResult } from '../../types/gate.types.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class CoverageCheck extends BaseCheck {
  name = 'coverage';
  description = 'Check test coverage thresholds';

  async run(context: CheckContext): Promise<GateResult> {
    try {
      const coveragePath = join(context.workspace_root, 'coverage', 'coverage-summary.json');
      
      if (!existsSync(coveragePath)) {
        return this.createFailure(
          'Coverage report not found',
          'Run tests with coverage first'
        );
      }

      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf-8'));
      const thresholds = context.check_config.thresholds || {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      };

      const results = this.analyzeCoverage(coverageData, thresholds);
      const overallScore = results.overall;
      const passed = overallScore >= (context.check_config.min_score || 80);

      const message = passed
        ? `Coverage passed: ${overallScore.toFixed(1)}% overall`
        : `Coverage failed: ${overallScore.toFixed(1)}% overall (required: ${context.check_config.min_score || 80}%)`;

      return this.createResult(
        passed,
        message,
        overallScore,
        results
      );
    } catch (error) {
      return this.createFailure(
        'Coverage check failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private analyzeCoverage(coverageData: any, thresholds: Record<string, number>) {
    const totals = coverageData.total;
    const results: any = {
      overall: 0,
      details: {},
      passed: true,
      failed_checks: []
    };

    // Calculate overall coverage as average of all metrics
    const metrics = ['lines', 'functions', 'branches', 'statements'];
    let totalCoverage = 0;
    let validMetrics = 0;

    for (const metric of metrics) {
      if (totals[metric]) {
        const coverage = totals[metric].pct;
        const threshold = thresholds[metric] || 0;
        
        results.details[metric] = {
          coverage,
          threshold,
          passed: coverage >= threshold
        };

        totalCoverage += coverage;
        validMetrics++;

        if (coverage < threshold) {
          results.passed = false;
          results.failed_checks.push(`${metric}: ${coverage}% < ${threshold}%`);
        }
      }
    }

    results.overall = validMetrics > 0 ? totalCoverage / validMetrics : 0;
    return results;
  }
}