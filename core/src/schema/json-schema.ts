import { zodToJsonSchema } from 'zod-to-json-schema';
import { APSPlanSchema, APS_SCHEMA_VERSION } from './aps.schema.js';
import type { JSONSchema7 } from 'json-schema';

/**
 * Generate JSON Schema from the Zod schema
 * This can be used for external tooling, documentation, or validation
 * with tools that require JSON Schema format
 */
export function generateJSONSchema(): JSONSchema7 {
  const jsonSchema = zodToJsonSchema(APSPlanSchema, {
    name: 'APSPlan',
    $refStrategy: 'none', // Inline all definitions for simplicity
    definitions: {
      APSPlan: APSPlanSchema,
    },
    errorMessages: true,
  }) as JSONSchema7;

  // Add metadata to the JSON Schema
  // Version is a custom extension to JSON Schema
  interface ExtendedJSONSchema extends JSONSchema7 {
    version?: string;
  }

  const schemaWithMetadata: ExtendedJSONSchema = {
    ...jsonSchema,
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `https://anvil.dev/schemas/aps/${APS_SCHEMA_VERSION}/plan.json`,
    title: 'Anvil Plan Specification (APS)',
    description:
      'Schema for Anvil Plan Specification - a deterministic plan format for development automation',
    version: APS_SCHEMA_VERSION,
  };

  return schemaWithMetadata as JSONSchema7;
}

/**
 * Get a formatted JSON Schema string
 */
export function getJSONSchemaString(pretty = true): string {
  const schema = generateJSONSchema();
  return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}
