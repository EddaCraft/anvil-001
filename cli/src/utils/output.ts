import chalk from 'chalk';

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function error(message: string): void {
  console.log(chalk.red('✗'), message);
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function formatValidationErrors(errors: any[]): void {
  if (errors.length === 0) return;

  console.log(chalk.red('\nValidation Errors:'));
  errors.forEach((error, index) => {
    console.log(chalk.red(`  ${index + 1}. ${error.message}`));
    if (error.path) {
      console.log(chalk.gray(`     at ${error.path}`));
    }
  });
}

export function formatGateResults(results: any): void {
  console.log(chalk.bold('\nGate Results:'));
  console.log(chalk.bold(`Overall: ${results.overall ? chalk.green('PASSED') : chalk.red('FAILED')}`));
  console.log(chalk.bold(`Score: ${results.score.toFixed(1)}%`));
  
  console.log(chalk.bold('\nCheck Results:'));
  results.checks.forEach((check: any) => {
    const status = check.passed ? chalk.green('PASS') : chalk.red('FAIL');
    const score = check.score ? ` (${check.score.toFixed(1)}%)` : '';
    console.log(`  ${status} ${check.check}${score}: ${check.message}`);
    
    if (check.error) {
      console.log(chalk.gray(`    Error: ${check.error}`));
    }
  });

  console.log(chalk.bold('\nSummary:'));
  console.log(`  Total: ${results.summary.total}`);
  console.log(`  Passed: ${chalk.green(results.summary.passed)}`);
  console.log(`  Failed: ${chalk.red(results.summary.failed)}`);
  console.log(`  Skipped: ${chalk.yellow(results.summary.skipped)}`);
}