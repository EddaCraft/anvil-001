import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { PlanData } from '@anvil/core';

export function loadPlan(path: string): PlanData {
  if (!existsSync(path)) {
    throw new Error(`Plan file not found: ${path}`);
  }

  try {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function findPlanById(id: string, workspaceRoot: string): string | null {
  const plansDir = join(workspaceRoot, '.anvil', 'plans');
  const planFile = join(plansDir, `${id}.json`);
  
  if (existsSync(planFile)) {
    return planFile;
  }
  
  return null;
}

export function ensureDirectory(path: string): void {
  const fs = require('fs-extra');
  fs.ensureDirSync(path);
}

export function getWorkspaceRoot(): string {
  // Look for package.json or .git directory to find workspace root
  let currentDir = process.cwd();
  
  while (currentDir !== '/') {
    if (existsSync(join(currentDir, 'package.json')) || existsSync(join(currentDir, '.git'))) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }
  
  return process.cwd();
}