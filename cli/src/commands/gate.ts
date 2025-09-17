import { Command } from 'commander';
import { GateRunner, GateConfigManager } from '@anvil/core';
import { loadPlan, findPlanById, getWorkspaceRoot } from '../utils/file-io.js';
import { success, error, formatGateResults } from '../utils/output.js';
import ora from 'ora';

export function createGateCommand(): Command {
  const command = new Command('gate');
  
  command
    .description('Run quality gates on a plan')
    .argument('<plan>', 'Plan ID or file path')
    .option('-c, --config <path>', 'Custom config file path')
    .option('-v, --verbose', 'Verbose output')
    .action(async (planArg: string, options: any) => {
      try {
        const workspaceRoot = getWorkspaceRoot();
        const configManager = new GateConfigManager(workspaceRoot);
        const gateRunner = new GateRunner();

        // Load plan
        let planPath: string;
        if (planArg.startsWith('aps-') && planArg.length === 12) {
          // Plan ID
          const foundPath = findPlanById(planArg, workspaceRoot);
          if (!foundPath) {
            error(`Plan not found: ${planArg}`);
            process.exit(1);
          }
          planPath = foundPath;
        } else {
          // File path
          planPath = planArg;
        }

        const spinner = ora('Loading plan...').start();
        const plan = loadPlan(planPath);
        spinner.succeed('Plan loaded');

        // Load config
        spinner.start('Loading gate configuration...');
        const config = configManager.loadConfig();
        spinner.succeed('Configuration loaded');

        // Run gate
        spinner.start('Running quality gates...');
        const results = await gateRunner.runGate(plan, config, workspaceRoot);
        spinner.succeed('Quality gates completed');

        // Display results
        formatGateResults(results);

        if (results.overall) {
          success('All quality gates passed!');
          process.exit(0);
        } else {
          error('Quality gates failed');
          process.exit(1);
        }
      } catch (err) {
        error(`Gate execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        process.exit(1);
      }
    });

  return command;
}