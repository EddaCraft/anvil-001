/**
 * Validation Error Types and Formatters
 *
 * Provides structured error types and user-friendly formatting utilities
 * for APS validation failures.
 */

import { ZodIssue } from 'zod';

/**
 * Base validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Schema validation error
 */
export class SchemaValidationError extends ValidationError {
  constructor(
    message: string,
    public readonly issues: ZodIssue[]
  ) {
    super(message, 'SCHEMA_VALIDATION_FAILED', issues);
    this.name = 'SchemaValidationError';
  }
}

/**
 * Hash validation error
 */
export class HashValidationError extends ValidationError {
  constructor(
    message: string,
    public readonly expectedHash: string,
    public readonly actualHash: string
  ) {
    super(message, 'HASH_VALIDATION_FAILED', { expectedHash, actualHash });
    this.name = 'HashValidationError';
  }
}

/**
 * Validation issue for structured error reporting
 */
export interface ValidationIssue {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

/**
 * Format Zod errors into user-friendly messages
 */
export function formatZodErrors(issues: ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join('.') : '<root>',
    message: formatZodMessage(issue),
    code: issue.code,
    severity: 'error' as const,
  }));
}

/**
 * Format a single Zod issue into a readable message
 */
function formatZodMessage(issue: ZodIssue): string {
  const path = issue.path.length > 0 ? `at "${issue.path.join('.')}"` : '';

  switch (issue.code) {
    case 'invalid_type':
      return `Invalid type ${path}: expected ${issue.expected}, received ${issue.received}`;

    case 'invalid_literal':
      return `Invalid value ${path}: expected ${JSON.stringify(issue.expected)}`;

    case 'too_small':
      if (issue.type === 'string') {
        return `String ${path} too short: minimum length is ${issue.minimum}`;
      }
      return `Value ${path} too small: minimum is ${issue.minimum}`;

    case 'too_big':
      if (issue.type === 'string') {
        return `String ${path} too long: maximum length is ${issue.maximum}`;
      }
      return `Value ${path} too large: maximum is ${issue.maximum}`;

    case 'invalid_string':
      if (issue.validation === 'regex') {
        return `Invalid format ${path}: value does not match expected pattern`;
      }
      return `Invalid string ${path}: ${issue.validation} validation failed`;

    case 'unrecognized_keys': {
      const keys = issue.keys.join(', ');
      return `Unexpected properties ${path}: ${keys}`;
    }

    default:
      return issue.message;
  }
}

/**
 * Format validation issues for CLI display
 */
export function formatValidationErrors(issues: ValidationIssue[]): string {
  if (issues.length === 0) {
    return 'No validation errors';
  }

  const lines: string[] = [
    `Found ${issues.length} validation error${issues.length > 1 ? 's' : ''}:`,
  ];

  issues.forEach((issue, index) => {
    const prefix = issue.severity === 'error' ? '❌' : '⚠️';
    lines.push(`\n${prefix} ${index + 1}. ${issue.message}`);
    if (issue.path !== '<root>') {
      lines.push(`   Path: ${issue.path}`);
    }
    lines.push(`   Code: ${issue.code}`);
  });

  return lines.join('\n');
}

/**
 * Create a validation summary for CLI output
 */
export function createValidationSummary(isValid: boolean, issues: ValidationIssue[] = []): string {
  if (isValid) {
    return '✅ Validation passed';
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  const parts: string[] = ['❌ Validation failed'];

  if (errorCount > 0) {
    parts.push(`${errorCount} error${errorCount > 1 ? 's' : ''}`);
  }

  if (warningCount > 0) {
    parts.push(`${warningCount} warning${warningCount > 1 ? 's' : ''}`);
  }

  return parts.join(' - ');
}
