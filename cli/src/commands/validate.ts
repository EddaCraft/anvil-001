/**
 * Validate Command - Validates APS plans
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { validateAPSPlan, verifyHash } from '@anvil/core';
import { loadPlan, findPlanById, getWorkspaceRoot } from '../utils/file-io.js';
import { existsSync } from 'fs';

export function createValidateCommand(): Command {
  return new Command('validate')
    .description('Validate an Anvil plan')
    .argument('<plan>', 'Plan file path or plan ID')
    .option('-v, --verbose', 'Show detailed validation results')
    .action(async (planPathOrId: string, options: { verbose: boolean }) => {
      const spinner = ora('Validating plan...').start();

      try {
        // Resolve plan path
        let planPath = planPathOrId;

        // Check if it's a plan ID (starts with 'aps-')
        if (planPathOrId.startsWith('aps-')) {
          const workspaceRoot = getWorkspaceRoot();
          const resolvedPath = findPlanById(planPathOrId, workspaceRoot);

          if (!resolvedPath) {
            throw new Error(`Plan with ID '${planPathOrId}' not found`);
          }

          planPath = resolvedPath;
        } else if (!existsSync(planPath)) {
          throw new Error(`Plan file not found: ${planPath}`);
        }

        // Load the plan (this will also validate the schema)
        const plan = await loadPlan(planPath);

        spinner.text = 'Checking schema compliance...';

        // Validate the plan
        const validationResult = await validateAPSPlan(plan);

        if (!validationResult.valid) {
          spinner.fail(chalk.red('✗ Plan validation failed'));
          console.error(chalk.red('\nValidation Errors:'));

          if (options.verbose && validationResult.issues) {
            // Show detailed errors
            validationResult.issues.forEach((error) => {
              console.error(chalk.yellow(`  - ${error.path || 'root'}:`), error.message);
            });
          } else if (validationResult.formattedErrors) {
            // Show formatted summary
            console.error(validationResult.formattedErrors);
          }

          process.exit(1);
        }

        spinner.text = 'Verifying plan hash...';

        // Verify hash integrity
        const hashValid = verifyHash(plan, plan.hash);

        if (!hashValid) {
          spinner.fail(chalk.red('✗ Hash verification failed'));
          console.error(chalk.red('\nThe plan hash does not match its content.'));
          console.error(chalk.yellow('This may indicate the plan has been tampered with.'));
          process.exit(1);
        }

        spinner.succeed(chalk.green('✓ Plan is valid'));

        // Display plan details
        console.log('\n' + chalk.bold('Plan Details:'));
        console.log(chalk.gray('  ID:           '), chalk.cyan(plan.id));
        console.log(chalk.gray('  Schema:       '), chalk.cyan(plan.schema_version));
        console.log(chalk.gray('  Hash:         '), chalk.cyan(plan.hash.substring(0, 16) + '...'));
        console.log(chalk.gray('  Intent:       '), chalk.white(plan.intent));
        console.log(
          chalk.gray('  Changes:      '),
          chalk.cyan(plan.proposed_changes.length.toString())
        );
        console.log(
          chalk.gray('  Evidence:     '),
          chalk.cyan((plan.evidence?.length ?? 0).toString())
        );

        if (plan.provenance) {
          console.log(
            chalk.gray('  Created By:   '),
            chalk.cyan(plan.provenance.author || 'unknown')
          );
          console.log(chalk.gray('  Created At:   '), chalk.cyan(plan.provenance.timestamp));
        }

        if (options.verbose && plan.validations) {
          console.log('\n' + chalk.bold('Required Checks:'));
          plan.validations.required_checks.forEach((check: string) => {
            console.log(chalk.gray('  - '), chalk.cyan(check));
          });
        }

        console.log(chalk.green('\n✓ All validation checks passed'));
      } catch (error) {
        spinner.fail(chalk.red('Validation failed'));
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });
}
