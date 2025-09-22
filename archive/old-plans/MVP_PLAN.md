# Anvil MVP Implementation Plan

## Project Overview

Anvil is a deterministic development automation platform that enforces quality gates and manages infrastructure-as-code through validated, reproducible plans.

## MVP Phases Overview

### Phase 1 — Core Spec & CLI (Weeks 2–3)

**Goal**: Make the CLI produce and validate deterministic plans.

### Phase 2 — Plan Gate (Weeks 4–5)

**Goal**: Enforce a single quality gate across basic checks.

### Phase 3 — Sidecar Runtime (Weeks 6–7)

**Goal**: Let Anvil sit beside the dev flow and act as arbiter.

### Phase 4 — Packs (Weeks 8–9)

**Goal**: Bootstrap features modularly.

### Phase 5 — Productioniser (Weeks 10–11)

**Goal**: Govern messy repos into shape.

### Phase 6 — Interfaces & DX (Weeks 12–13)

**Goal**: Make Anvil nice to use.

## Phase 1 Detailed Specification

### Core Components

#### 1. APS (Anvil Plan Spec) Schema

- **Version**: 1.0.0
- **Format**: JSON Schema 2020-12
- **Purpose**: Define the structure for deterministic, validated development plans

##### Schema Structure

```json
{
  "id": "Unique plan identifier (aps-[hash8])",
  "hash": "SHA-256 hash of plan contents",
  "intent": "Human-readable purpose",
  "proposed_changes": [
    {
      "type": "file|package|config|command",
      "target": "Resource identifier",
      "action": "create|update|delete|execute",
      "content": "Change payload"
    }
  ],
  "provenance": {
    "created_at": "ISO 8601 timestamp",
    "created_by": "User/system identifier",
    "version": "Semantic version"
  },
  "validations": {
    "required_checks": ["Array of check names"],
    "thresholds": {
      "coverage": "Minimum coverage percentage",
      "lint_score": "Minimum lint score"
    }
  }
}
```

#### 2. Core Library (`@anvil/core`)

- **Location**: `/core/src/`
- **Responsibilities**:
  - APS schema definition and validation
  - Deterministic hash generation
  - Plan validation logic
  - Shared types and utilities

##### Directory Structure

```
core/src/
├── schema/
│   ├── aps.schema.json       # JSON Schema definition
│   └── index.ts               # Schema exports
├── types/
│   ├── aps.types.ts          # TypeScript types
│   └── index.ts              # Type exports
├── crypto/
│   ├── hash.ts               # SHA-256 hashing
│   └── index.ts              # Crypto exports
├── validation/
│   ├── aps-validator.ts      # APS validation logic
│   ├── errors.ts             # Validation error types
│   └── index.ts              # Validation exports
└── index.ts                  # Main exports
```

#### 3. CLI Package (`@anvil/cli`)

- **Location**: `/cli/src/`
- **Binary**: `anvil`
- **Framework**: Commander.js

##### Commands

1. **`anvil plan <intent>`**
   - Creates a new APS plan from an intent description
   - Generates unique ID and hash
   - Saves to `.anvil/plans/` directory

2. **`anvil validate <plan>`**
   - Validates plan against APS schema
   - Verifies hash integrity
   - Reports validation errors

3. **`anvil export <plan>`**
   - Exports plan to JSON or YAML
   - Options: `--format`, `--output`

##### Directory Structure

```
cli/src/
├── commands/
│   ├── plan.ts               # Plan generation command
│   ├── validate.ts           # Validation command
│   ├── export.ts            # Export command
│   └── index.ts             # Command registry
├── utils/
│   ├── file-io.ts           # File operations
│   ├── output.ts            # Formatted output
│   ├── errors.ts            # Error handling
│   └── index.ts             # Utility exports
├── config/
│   ├── defaults.ts          # Default configurations
│   └── index.ts             # Config exports
└── index.ts                 # CLI entry point
```

### Technical Decisions

#### Dependencies

**Core Package**:

- `ajv` (v8.x) - JSON Schema validation
- `ajv-formats` - Additional format validators
- `js-yaml` - YAML parsing

**CLI Package**:

- `commander` - CLI framework
- `chalk` - Colored output
- `ora` - Loading spinners
- `inquirer` - Interactive prompts

#### Testing Strategy

- **Unit Tests**: Individual component validation
- **Integration Tests**: End-to-end command workflows
- **Golden Tests**: Deterministic hash verification
- **Coverage Target**: >90% for core logic

#### Quality Gates

- TypeScript strict mode
- ESLint with project rules
- Prettier formatting
- Pre-commit hooks via Husky

### Success Metrics

1. ✅ CLI generates valid APS plans from intent strings
2. ✅ Validator correctly accepts/rejects plans
3. ✅ Hash generation is deterministic and verifiable
4. ✅ All tests pass with >90% coverage
5. ✅ Clear, colored CLI output
6. ✅ Export to JSON and YAML formats

### Development Workflow

#### Week 1: Core Implementation

- Day 1-2: APS schema and TypeScript types
- Day 3-4: Hash generation and validation
- Day 5: Core package testing

#### Week 2: CLI Implementation

- Day 1-2: CLI structure and plan command
- Day 3: Validate and export commands
- Day 4-5: CLI testing and integration

### API Examples

#### Creating a Plan

```typescript
import { createPlan } from '@anvil/core';

const plan = createPlan({
  intent: 'Add TypeScript support to project',
  changes: [
    { type: 'package', target: 'typescript', action: 'create' },
    { type: 'file', target: 'tsconfig.json', action: 'create' },
  ],
});
```

#### Validating a Plan

```typescript
import { validatePlan } from '@anvil/core';

const result = await validatePlan(planData);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

#### CLI Usage

```bash
# Create a new plan
$ anvil plan "Add authentication to the application"
✓ Created plan: aps-a3f4b2c8
✓ Saved to: .anvil/plans/aps-a3f4b2c8.json

# Validate a plan
$ anvil validate .anvil/plans/aps-a3f4b2c8.json
✓ Plan is valid
✓ Hash verified: 3f4a8b2c...

# Export a plan
$ anvil export aps-a3f4b2c8 --format yaml --output plan.yml
✓ Exported to: plan.yml
```

## Phase 2 Preview: Plan Gate

### Components

- Gate runner with pluggable checks
- ESLint integration via API
- Vitest coverage integration
- Secret scanning (regex-based)
- OPA/Rego policy engine (stretch)

### Commands

- `anvil gate <plan>` - Run quality checks
- `anvil gate:config` - Configure gate rules

## Phase 3 Preview: Sidecar Runtime

### Components

- Long-running daemon process
- JSON-RPC protocol over stdin/stdout
- State management for rollback
- GitHub Action templates

### Commands

- `anvil daemon start` - Start sidecar
- `anvil apply <plan>` - Execute plan
- `anvil rollback <plan>` - Revert changes

## Appendix: File Formats

### APS JSON Example

```json
{
  "id": "aps-a3f4b2c8",
  "hash": "3f4a8b2c9d1e5f7a8b3c4d6e7f9a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
  "intent": "Add authentication to the application",
  "proposed_changes": [
    {
      "type": "package",
      "target": "@supabase/supabase-js",
      "action": "create",
      "content": { "version": "^2.0.0" }
    },
    {
      "type": "file",
      "target": "src/lib/auth.ts",
      "action": "create",
      "content": "// Authentication module"
    }
  ],
  "provenance": {
    "created_at": "2024-01-15T10:30:00Z",
    "created_by": "user@example.com",
    "version": "1.0.0"
  },
  "validations": {
    "required_checks": ["lint", "test", "security"],
    "thresholds": {
      "coverage": 80,
      "lint_score": 90
    }
  }
}
```

### Configuration File (.anvilrc)

```yaml
version: 1
defaults:
  plan_directory: .anvil/plans
  export_format: json

gates:
  - name: security
    enabled: true
    config:
      scan_patterns:
        - '*.env'
        - '*.key'

  - name: coverage
    enabled: true
    config:
      minimum: 80

packs:
  installed:
    - feature-flags
    - telemetry-lite
```
