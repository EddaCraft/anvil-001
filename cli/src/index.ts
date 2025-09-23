#!/usr/bin/env node

import { Command } from 'commander';
import { createGateCommand } from './commands/gate.js';
import { createGateConfigCommand } from './commands/gate-config.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('anvil')
  .description('Anvil - Deterministic development automation platform')
  .version(packageJson.version);

// Register commands
program.addCommand(createGateCommand());
program.addCommand(createGateConfigCommand());

// Parse command line arguments
program.parse();
