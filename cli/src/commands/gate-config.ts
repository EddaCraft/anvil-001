import { Command } from 'commander';
import { GateConfigManager } from '@anvil/core';
import { getWorkspaceRoot } from '../utils/file-io.js';
import { success, error } from '../utils/output.js';
import inquirer from 'inquirer';

export function createGateConfigCommand(): Command {
  const command = new Command('gate:config');
  
  command
    .description('Configure gate settings')
    .option('-l, --list', 'List current configuration')
    .option('-e, --enable <check>', 'Enable a specific check')
    .option('-d, --disable <check>', 'Disable a specific check')
    .option('-i, --interactive', 'Interactive configuration')
    .action(async (options: any) => {
      try {
        const workspaceRoot = getWorkspaceRoot();
        const configManager = new GateConfigManager(workspaceRoot);

        if (options.list) {
          const config = configManager.loadConfig();
          console.log('\nCurrent Gate Configuration:');
          console.log('========================');
          console.log(`Overall Score Threshold: ${config.thresholds.overall_score}%`);
          console.log('\nChecks:');
          config.checks.forEach(check => {
            const status = check.enabled ? '✓' : '✗';
            console.log(`  ${status} ${check.name}: ${check.description}`);
            if (check.config && Object.keys(check.config).length > 0) {
              console.log(`    Config: ${JSON.stringify(check.config, null, 2)}`);
            }
          });
          return;
        }

        if (options.enable) {
          configManager.enableCheck(options.enable);
          success(`Enabled check: ${options.enable}`);
          return;
        }

        if (options.disable) {
          configManager.disableCheck(options.disable);
          success(`Disabled check: ${options.disable}`);
          return;
        }

        if (options.interactive) {
          await runInteractiveConfig(configManager);
          return;
        }

        // Default: show help
        command.help();
      } catch (err) {
        error(`Configuration failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        process.exit(1);
      }
    });

  return command;
}

async function runInteractiveConfig(configManager: GateConfigManager): Promise<void> {
  const config = configManager.loadConfig();
  
  console.log('\nInteractive Gate Configuration');
  console.log('=============================\n');

  // Configure overall threshold
  const { overallThreshold } = await inquirer.prompt([
    {
      type: 'number',
      name: 'overallThreshold',
      message: 'Overall score threshold (0-100):',
      default: config.thresholds.overall_score,
      validate: (input: number) => input >= 0 && input <= 100 || 'Must be between 0 and 100'
    }
  ]);

  config.thresholds.overall_score = overallThreshold;

  // Configure individual checks
  for (const check of config.checks) {
    const { enabled, minScore } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: `Enable ${check.name} check?`,
        default: check.enabled
      },
      {
        type: 'number',
        name: 'minScore',
        message: `Minimum score for ${check.name} (0-100):`,
        default: check.config?.min_score || 80,
        validate: (input: number) => input >= 0 && input <= 100 || 'Must be between 0 and 100',
        when: (answers: any) => answers.enabled
      }
    ]);

    check.enabled = enabled;
    if (enabled && minScore !== undefined) {
      check.config = { ...check.config, min_score: minScore };
    }
  }

  configManager.saveConfig(config);
  success('Configuration saved successfully!');
}