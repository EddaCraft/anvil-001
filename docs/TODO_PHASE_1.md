# Phase 1 TODO: Core Spec & CLI Implementation

## Overview

**Timeline**: Weeks 2-3
**Goal**: Build APS (Anvil Plan Spec) schema, validation, and CLI commands for deterministic plans
**Status**: 🚧 In Progress

---

## 📦 Core Package (`@anvil/core`)

### Setup & Dependencies

- [x] Add `ajv` (v8.17.1) - JSON Schema validation
- [x] Add `ajv-formats` (v3.0.1) - Format validators
- [x] Add `js-yaml` (v4.1.0) - YAML parsing
- [x] Add `@types/js-yaml` - TypeScript types

### APS Schema Implementation

- [ ] **Create schema directory structure**

  ```
  core/src/schema/
  ├── aps.schema.json
  └── index.ts
  ```

- [ ] **Define APS JSON Schema** (`aps.schema.json`)
  - [ ] Schema metadata ($schema, $id, version)
  - [ ] Core fields definition:
    - [ ] `id`: Pattern `^aps-[a-f0-9]{8}$`
    - [ ] `hash`: SHA-256 pattern `^[a-f0-9]{64}$`
    - [ ] `intent`: String with min/max length
    - [ ] `proposed_changes`: Array of change objects
    - [ ] `provenance`: Creation metadata
    - [ ] `validations`: Check requirements
  - [ ] Required fields configuration
  - [ ] Field constraints and formats

### TypeScript Types

- [ ] **Create types directory**

  ```
  core/src/types/
  ├── aps.types.ts
  └── index.ts
  ```

- [ ] **Generate TypeScript types from schema**
  - [ ] Create type generation script
  - [ ] Define interfaces:
    - [ ] `APSPlan` - Main plan interface
    - [ ] `APSChange` - Change object interface
    - [ ] `APSProvenance` - Metadata interface
    - [ ] `APSValidations` - Validation config interface
  - [ ] Export all types

### Hash Generation

- [ ] **Create crypto utilities**

  ```
  core/src/crypto/
  ├── hash.ts
  └── index.ts
  ```

- [ ] **Implement hash functions** (`hash.ts`)
  - [ ] `generateHash(data: any): string` - SHA-256 hash
  - [ ] `canonicalizeJSON(obj: any): string` - Stable serialization
  - [ ] `verifyHash(data: any, hash: string): boolean` - Verification
  - [ ] `generatePlanId(): string` - Unique ID generation

### Validation Implementation

- [ ] **Create validation module**

  ```
  core/src/validation/
  ├── aps-validator.ts
  ├── errors.ts
  └── index.ts
  ```

- [ ] **APS Validator Class** (`aps-validator.ts`)
  - [ ] Initialize Ajv with formats
  - [ ] Load and compile schema
  - [ ] `validate(plan: unknown): ValidationResult`
  - [ ] `validateSchema(plan: any): boolean`
  - [ ] `validateHash(plan: APSPlan): boolean`
  - [ ] Format error messages

- [ ] **Error Types** (`errors.ts`)
  - [ ] `ValidationError` class
  - [ ] `SchemaError` type
  - [ ] Error formatting utilities

### Core Package Testing

- [ ] **Hash generation tests** (`crypto/hash.test.ts`)
  - [ ] Deterministic output test
  - [ ] Different input order test
  - [ ] Hash verification test
  - [ ] ID generation uniqueness

- [ ] **Validator tests** (`validation/aps-validator.test.ts`)
  - [ ] Valid schema acceptance
  - [ ] Invalid schema rejection
  - [ ] Missing required fields
  - [ ] Invalid field formats
  - [ ] Hash mismatch detection

- [ ] **Golden file tests**
  - [ ] Reference plans with known hashes
  - [ ] Regression test suite

---

## 🖥️ CLI Package (`@anvil/cli`)

### Setup & Dependencies

- [ ] Add `commander` (v12.x) - CLI framework
- [ ] Add `chalk` (v5.x) - Colored output
- [ ] Add `ora` (v8.x) - Loading spinners
- [ ] Add `inquirer` (v9.x) - Interactive prompts
- [ ] Add `fs-extra` (v11.x) - File operations

### CLI Structure

- [ ] **Create CLI directory structure**

  ```
  cli/src/
  ├── commands/
  ├── utils/
  ├── config/
  └── index.ts
  ```

- [ ] **Main entry point** (`index.ts`)
  - [ ] Add shebang `#!/usr/bin/env node`
  - [ ] Setup commander program
  - [ ] Register all commands
  - [ ] Add version from package.json
  - [ ] Configure help display

### Plan Command

- [ ] **Implement `anvil plan <intent>`** (`commands/plan.ts`)
  - [ ] Parse intent argument
  - [ ] Generate plan structure:
    - [ ] Create unique ID
    - [ ] Set intent description
    - [ ] Initialize empty changes array
    - [ ] Add provenance data
    - [ ] Generate hash
  - [ ] Create `.anvil/plans/` directory
  - [ ] Save plan as JSON
  - [ ] Display success message with plan ID

### Validate Command

- [ ] **Implement `anvil validate <plan>`** (`commands/validate.ts`)
  - [ ] Accept file path or plan ID
  - [ ] Load plan from file:
    - [ ] Support JSON format
    - [ ] Support YAML format
  - [ ] Run validation:
    - [ ] Schema validation
    - [ ] Hash verification
  - [ ] Display results:
    - [ ] ✅ Green for valid
    - [ ] ❌ Red for invalid
    - [ ] Show specific errors
  - [ ] Exit with appropriate code

### Export Command

- [ ] **Implement `anvil export <plan>`** (`commands/export.ts`)
  - [ ] Accept plan ID or file path
  - [ ] Options:
    - [ ] `--format <json|yaml>` (default: json)
    - [ ] `--output <path>` (default: stdout)
    - [ ] `--pretty` - Pretty print JSON
  - [ ] Load and convert plan
  - [ ] Write to file or stdout
  - [ ] Display success message

### Utility Functions

- [ ] **File I/O utilities** (`utils/file-io.ts`)
  - [ ] `loadPlan(path: string): APSPlan`
  - [ ] `savePlan(plan: APSPlan, path: string)`
  - [ ] `ensureDirectory(path: string)`
  - [ ] `findPlanById(id: string): string | null`

- [ ] **Output formatting** (`utils/output.ts`)
  - [ ] `success(message: string)`
  - [ ] `error(message: string)`
  - [ ] `warning(message: string)`
  - [ ] `info(message: string)`
  - [ ] `formatValidationErrors(errors: any[])`

### CLI Testing

- [ ] **Plan command tests** (`commands/plan.test.ts`)
  - [ ] Plan creation with intent
  - [ ] ID generation
  - [ ] File saving
  - [ ] Directory creation

- [ ] **Validate command tests** (`commands/validate.test.ts`)
  - [ ] Valid plan acceptance
  - [ ] Invalid plan rejection
  - [ ] File loading (JSON/YAML)
  - [ ] Error display
  - [ ] Exit codes

- [ ] **Export command tests** (`commands/export.test.ts`)
  - [ ] JSON export
  - [ ] YAML export
  - [ ] File output
  - [ ] Pretty printing

---

## 🧪 Integration Testing

### End-to-End Tests

- [ ] **Complete workflow test**
  - [ ] Create plan with CLI
  - [ ] Validate created plan
  - [ ] Export to YAML
  - [ ] Re-import and validate YAML

- [ ] **Error scenarios**
  - [ ] Invalid plan rejection
  - [ ] Missing file handling
  - [ ] Corrupted plan detection

### CI/CD Integration

- [ ] **Update GitHub Actions**
  - [ ] Add CLI build step
  - [ ] Run integration tests
  - [ ] Build CLI binary
  - [ ] Upload artifacts

---

## 📚 Documentation

### API Documentation

- [ ] **Core package docs**
  - [ ] APS schema field descriptions
  - [ ] Validation API reference
  - [ ] Hash generation guide
  - [ ] TypeScript type definitions

### CLI Documentation

- [ ] **Usage documentation**
  - [ ] Command reference
  - [ ] Examples for each command
  - [ ] Configuration options
  - [ ] Troubleshooting guide

- [ ] **Update README**
  - [ ] Installation instructions
  - [ ] Quick start guide
  - [ ] Command overview

### Developer Documentation

- [ ] **Contributing guide**
  - [ ] Development setup
  - [ ] Testing guidelines
  - [ ] Code structure explanation

---

## 🎯 Success Criteria Checklist

- [ ] ✅ CLI can generate valid APS plans from intent strings
- [ ] ✅ Validator correctly accepts valid plans
- [ ] ✅ Validator correctly rejects invalid plans with clear errors
- [ ] ✅ Hash generation is deterministic across runs
- [ ] ✅ Hash verification detects tampering
- [ ] ✅ All unit tests pass
- [ ] ✅ Test coverage >90% for core logic
- [ ] ✅ CLI provides colored, user-friendly output
- [ ] ✅ Plans can be exported to JSON format
- [ ] ✅ Plans can be exported to YAML format
- [ ] ✅ Integration tests pass
- [ ] ✅ Documentation is complete

---

## 📊 Progress Tracking

### Week 1 Goals

- [ ] Complete core package implementation
- [ ] Achieve 90% test coverage on core
- [ ] Schema fully defined and validated

### Week 2 Goals

- [ ] Complete CLI implementation
- [ ] All commands functional
- [ ] Integration tests passing
- [ ] Documentation complete

### Current Blockers

- None yet

### Notes

- Consider adding JSON Schema validation for the CLI config file
- May need to add support for plan templates in future phases
- Watch for performance with large plans

---

## 🔄 Daily Standup Template

### What was completed yesterday?

-

### What will be done today?

-

### Any blockers?

-

### Testing status

- Unit tests: 0/20
- Integration tests: 0/5
- Coverage: 0%
