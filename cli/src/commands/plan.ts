/**
 * Plan Command - Creates new APS plans
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { APSPlan, generatePlanId, generateHash, APS_SCHEMA_VERSION } from '@anvil/core';
import { savePlan, getWorkspaceRoot } from '../utils/file-io.js';
import { join } from 'path';

export function createPlanCommand(): Command {
  return new Command('plan')
    .description('Create a new Anvil plan')
    .argument('<intent>', 'What you want to achieve (10-500 characters)')
    .option('-f, --format <format>', 'Output format (json|yaml)', 'json')
    .option('-o, --output <path>', 'Output file path')
    .action(async (intent: string, options: { format: string; output?: string }) => {
      const spinner = ora('Creating plan...').start();

      try {
        // Validate intent length
        if (intent.length < 10) {
          throw new Error('Intent must be at least 10 characters long');
        }
        if (intent.length > 500) {
          throw new Error('Intent must not exceed 500 characters');
        }

        // Generate plan ID
        const planId = generatePlanId();

        // Create the plan structure
        const plan: Omit<APSPlan, 'hash'> = {
          schema_version: APS_SCHEMA_VERSION,
          id: planId,
          intent,
          proposed_changes: [],
          provenance: {
            timestamp: new Date().toISOString(),
            author: process.env.USER || 'unknown',
            source: 'cli',
            version: '0.0.0',
            repository: process.cwd(),
            branch: 'main', // TODO: Get from git
            commit: '', // TODO: Get from git
          },
          validations: {
            required_checks: ['lint', 'test', 'coverage', 'secrets'],
            skip_checks: [],
          },
          evidence: [],
          executions: [],
        };

        // Generate hash (excluding the hash field itself)
        const hash = generateHash(plan);

        // Add hash to the plan
        const completePlan: APSPlan = {
          ...plan,
          hash,
        } as APSPlan;

        // Determine output path
        const workspaceRoot = getWorkspaceRoot();
        const defaultPath = join(workspaceRoot, '.anvil', 'plans', `${planId}.${options.format}`);
        const outputPath = options.output || defaultPath;

        // Save the plan
        savePlan(completePlan, outputPath);

        spinner.succeed(chalk.green(`✓ Plan created successfully`));
        console.log(chalk.gray('  ID:     '), chalk.cyan(planId));
        console.log(chalk.gray('  Hash:   '), chalk.cyan(hash.substring(0, 16) + '...'));
        console.log(chalk.gray('  Path:   '), chalk.cyan(outputPath));
        console.log(chalk.gray('  Intent: '), chalk.white(intent));
      } catch (error) {
        spinner.fail(chalk.red('Failed to create plan'));
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });
}
