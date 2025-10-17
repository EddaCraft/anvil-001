/**
 * Hash Generation Utilities
 *
 * Provides deterministic hashing functions for APS plans
 * ensuring data integrity and immutability.
 */

import { createHash, randomBytes } from 'node:crypto';

/**
 * Generates a SHA-256 hash of the provided data
 * @param data - The data to hash (will be canonicalized if object)
 * @returns Hexadecimal string representation of the hash
 */
export function generateHash(data: unknown): string {
  // Convert data to canonical JSON string if it's an object
  const content = typeof data === 'object' && data !== null ? canonicalizeJSON(data) : String(data);

  // Create SHA-256 hash
  const hash = createHash('sha256');
  hash.update(content, 'utf8');
  return hash.digest('hex');
}

/**
 * Converts an object to a canonical JSON string with sorted keys
 * This ensures consistent hashing regardless of property order
 * @param obj - The object to serialize
 * @returns Canonical JSON string representation
 */
export function canonicalizeJSON(obj: unknown): string {
  if (obj === null) {
    return 'null';
  }

  if (obj === undefined) {
    return 'undefined';
  }

  if (typeof obj === 'string') {
    return JSON.stringify(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    // Recursively canonicalize array elements
    const elements = obj.map((element) => canonicalizeJSON(element));
    return `[${elements.join(',')}]`;
  }

  if (obj instanceof Date) {
    return JSON.stringify(obj.toISOString());
  }

  if (typeof obj === 'object') {
    // Sort object keys and recursively canonicalize values
    const sortedKeys = Object.keys(obj).sort();
    const pairs = sortedKeys
      .map((key) => {
        const value = (obj as Record<string, unknown>)[key];
        // Skip undefined values (like JSON.stringify does)
        if (value === undefined) {
          return null;
        }
        return `${JSON.stringify(key)}:${canonicalizeJSON(value)}`;
      })
      .filter((pair) => pair !== null);

    return `{${pairs.join(',')}}`;
  }

  // Fallback for other types
  return JSON.stringify(obj);
}

/**
 * Verifies that the provided hash matches the hash of the data
 * @param data - The data to verify
 * @param expectedHash - The expected hash value
 * @returns True if hashes match, false otherwise
 */
export function verifyHash(data: unknown, expectedHash: string): boolean {
  const actualHash = generateHash(data);
  return actualHash === expectedHash;
}

/**
 * Generates a unique plan ID in the format 'aps-[8 hex chars]'
 * @returns A unique plan identifier
 */
export function generatePlanId(): string {
  // Generate 4 random bytes (8 hex characters)
  const buffer = randomBytes(4);
  const hexString = buffer.toString('hex');
  return `aps-${hexString}`;
}

/**
 * Validates that a string is a valid plan ID format
 * @param id - The ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidPlanId(id: string): boolean {
  return /^aps-[a-f0-9]{8}$/.test(id);
}

/**
 * Validates that a string is a valid SHA-256 hash
 * @param hash - The hash to validate
 * @returns True if valid, false otherwise
 */
export function isValidHash(hash: string): boolean {
  return /^[a-f0-9]{64}$/.test(hash);
}
