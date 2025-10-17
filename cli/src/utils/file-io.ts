import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { APSPlan, validatePlan } from '@anvil/core';
import { ensureDirSync } from 'fs-extra';

export async function loadPlan(path: string): Promise<APSPlan> {
  if (!existsSync(path)) {
    throw new Error(`Plan file not found: ${path}`);
  }

  try {
    const content = readFileSync(path, 'utf-8');
    const data = JSON.parse(content);

    // Validate the plan
    const validationResult = validatePlan(data);

    if (!validationResult.success) {
      const errorMessages =
        validationResult.errors?.map((e) => e.message).join(', ') || 'Unknown validation error';
      throw new Error(`Invalid plan: ${errorMessages}`);
    }

    return validationResult.data as APSPlan;
  } catch (error) {
    throw new Error(
      `Failed to load plan: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function savePlan(plan: APSPlan, path: string): void {
  ensureDirSync(dirname(path));
  writeFileSync(path, JSON.stringify(plan, null, 2), 'utf-8');
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
  ensureDirSync(path);
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
