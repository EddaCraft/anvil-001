# Anvil Implementation TODO

This document provides a comprehensive task list for implementing the Anvil
platform. Tasks are organized by phase and epic, with detailed acceptance
criteria and dependencies. For strategic context, see [PLAN.md](./PLAN.md).

## Progress Tracking

- **Current Phase**: Phase 1 – Foundations
- **Current Epic**: Setup & Infrastructure
- **Overall Progress**: ~5% (15/300+ tasks completed) _(unchanged)_

## Phase 1: Foundations

### Epic: Infrastructure Setup

#### Repository Structure

- [x] **Initialize Nx monorepo structure** ✅
  - [x] Verify current structure matches requirements
  - [x] Ensure folders exist: `core/`, `cli/`, `packs/`, `ui/` (placeholder)
  - [x] Configure `pnpm-workspace.yaml` correctly
  - **Acceptance**: Repository structure matches architecture plan
  - **Date Completed**: 2025-09-22
  - **Date Committed**: 2025-09-22

- [x] **Configure CI/CD pipeline** ✅
  - [x] GitHub Actions workflow for lint + test
  - [x] Status badges in README
  - [x] Node.js version pinning (>=18.0.0)
  - [x] Cache pnpm dependencies
  - **Acceptance**: CI passes on empty repository
  - **Dependencies**: Repository structure
  - **Date Completed**: 2025-09-22
  - **Date Committed**: 2025-09-22

- [x] **Setup quality gates**
  - [x] ESLint configuration with TypeScript rules
  - [x] Prettier formatting rules
  - [x] Husky pre-commit hooks
  - [x] TypeScript strict mode configuration
  - **Acceptance**: Code quality tools run automatically
  - **Dependencies**: Repository structure
  - **Date Completed**: 2025-09-22
  - **Date Committed**: 2025-09-22

## Phase 2: APS Spine

### Epic: APS Core Implementation

#### Schema Definition

- [x] **Create schema directory structure** ✅

  ```text
  core/src/schema/
  ├── aps.schema.ts
  ├── index.ts
  └── aps.schema.json (generated)
  ```

  - **Acceptance**: Directory structure exists and exports schema
  - **Date Completed**: 2025-09-23
  - **Date Committed**: Pending

- [x] **Define APS Zod Schema** (`aps.schema.ts`) ✅
  - [x] Import and configure Zod with strict mode
  - [x] Define schema version as literal type
  - [x] Core fields definition using Zod:
    - [x] `id`: z.string() with regex pattern `^aps-[a-f0-9]{8}$`
    - [x] `hash`: z.string() with SHA-256 pattern `^[a-f0-9]{64}$`
    - [x] `intent`: z.string() with min(10) and max(500)
    - [x] `proposed_changes`: z.array() of change objects
    - [x] `provenance`: z.object() for creation metadata
    - [x] `validations`: z.object() for check requirements
  - [x] Add Zod branding for type safety
  - [x] Export inferred TypeScript types from Zod schema
  - **Acceptance**: Zod schema validates example plans with clear error messages
  - **Date Completed**: 2025-09-23
  - **Date Committed**: 2025-09-23

- [x] **Generate JSON Schema from Zod** (`aps.schema.json`) ✅
  - [x] Use zod-to-json-schema library
  - [x] Export JSON Schema with proper $schema and $id
  - [x] Add generation script to package.json
  - [x] Verify JSON Schema matches Zod validation rules
  - **Acceptance**: JSON Schema is automatically generated from Zod definition
  - **Dependencies**: Zod schema definition
  - **Date Completed**: 2025-09-23
  - **Date Committed**: 2025-09-23

#### TypeScript Types

- [x] **Create types directory**

  ```text
  core/src/types/
  ├── aps.types.ts
  └── index.ts
  ```

  - **Acceptance**: Type exports are available
  - **Date Completed**:
  - **Date Committed**:

- [x] **Export TypeScript types from Zod schema** ✅
  - [x] Use Zod's type inference (z.infer<typeof schema>)
  - [x] Export inferred types:
    - [x] `APSPlan` - Inferred from main Zod schema
    - [x] `APSChange` - Inferred from change schema (named `Change`)
    - [x] `APSProvenance` - Inferred from provenance schema (named `Provenance`)
    - [x] `APSValidations` - Inferred from validations schema (named
          `Validation`)
  - [x] Add JSDoc documentation to exported types
  - [x] Re-export from schema/index.ts for convenience
  - **Acceptance**: Types automatically stay in sync with Zod schema
  - **Dependencies**: Zod schema definition
  - **Date Completed**: 2025-09-23
  - **Date Committed**: Pending

#### Hash Generation

- [x] **Create crypto utilities** ✅

  ```text
  core/src/crypto/
  ├── hash.ts
  └── index.ts
  ```

  - **Acceptance**: Crypto module exports hash functions
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending
  - **Date Completed**:
  - **Date Committed**:

- [x] **Implement hash functions** (`hash.ts`) ✅
  - [x] `generateHash(data: any): string` - SHA-256 hash
  - [x] `canonicalizeJSON(obj: any): string` - Stable serialization
  - [x] `verifyHash(data: any, hash: string): boolean` - Verification
  - [x] `generatePlanId(): string` - Unique ID generation (aps-[8 hex chars])
  - [x] `isValidPlanId(id: string): boolean` - Plan ID validation
  - [x] `isValidHash(hash: string): boolean` - Hash format validation
  - **Acceptance**: Hash generation is deterministic across runs
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

#### Validation Implementation

- [x] **Create validation module** ✅

  ```text
  core/src/validation/
  ├── aps-validator.ts
  ├── errors.ts
  └── index.ts
  ```

  - **Acceptance**: Validation module structure exists
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

- [x] **APS Validator Class** (`aps-validator.ts`) ✅
  - [x] Use Zod schema for primary validation
  - [x] Implement safe parse with error handling
  - [x] `validate(plan: unknown): ValidationResult`
  - [x] `validateSchema(plan: any): boolean` using Zod
  - [x] `validateHash(plan: APSPlan): boolean`
  - [x] Format Zod errors for user-friendly CLI display
  - [x] Optional: Ajv validation using exported JSON Schema for compatibility
  - **Acceptance**: Validator correctly accepts/rejects plans with clear errors
  - **Dependencies**: Zod schema definition, Hash generation
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

- [x] **Error Types** (`errors.ts`) ✅
  - [x] `ValidationError` class with structured data
  - [x] `ZodError` formatting for schema validation errors
  - [x] Error formatting utilities for user-friendly messages
  - **Acceptance**: Error messages are clear and actionable
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

#### Core Package Dependencies

- [x] **Add required dependencies** ✅
  - [x] Add `zod` (v3.x) - Runtime validation and TypeScript types
  - [x] Add `zod-to-json-schema` (v3.x) - JSON Schema export
  - [x] Add `js-yaml` (v4.1.0) - YAML parsing
  - [x] Add `@types/js-yaml` - TypeScript types
  - [x] Add `ajv` (v8.17.1) - JSON Schema validation (already present)
  - [x] Add `ajv-formats` (v3.0.1) - Format validators (already present)
  - **Acceptance**: Dependencies installed and configured
  - **Date Completed**: 2025-09-23
  - **Date Committed**: Pending

#### Core Package Testing

- [x] **Hash generation tests** (`crypto/hash.test.ts`) ✅
  - [x] Deterministic output test (same input = same hash)
  - [x] Different input order test (object property order independence)
  - [x] Hash verification test (valid/invalid hash detection)
  - [x] ID generation uniqueness test
  - [x] Canonical JSON serialization tests
  - [x] Edge cases (null, undefined, arrays, dates)
  - **Acceptance**: 100% test coverage, all edge cases covered
  - **Dependencies**: Hash implementation
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

- [x] **Validator tests** (`validation/aps-validator.test.ts`) ✅
  - [x] Valid schema acceptance tests
  - [x] Invalid schema rejection tests
  - [x] Missing required fields tests
  - [x] Invalid field formats tests
  - [x] Hash mismatch detection tests
  - **Acceptance**: >95% test coverage, clear test descriptions
  - **Dependencies**: Validator implementation
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

- [x] **Golden file tests** ✅
  - [x] Reference plans with known hashes
  - [x] Regression test suite for hash stability
  - [x] Cross-platform hash consistency tests
  - **Acceptance**: Golden tests prevent hash regressions
  - **Dependencies**: Hash implementation, Validator implementation
  - **Date Completed**: 2025-09-26
  - **Date Committed**: Pending

## **Phase 2.5: APS Interop (SpecKit & BMAD)** **[NEW]**

### Epic: Adapters & Normalisation

- [ ] **SpecKit import** (`adapters/speckit/import.ts`) **[NEW]**
  - Parse `spec.md` / `plan.md` / `tasks.md` → APS
  - Preserve metadata; map tasks to APS steps
  - **Acceptance**: Valid APS generated from SpecKit docs

- [ ] **SpecKit export** (`adapters/speckit/export.ts`) **[NEW]**
  - APS → update `tasks.md` progress + plan summary
  - **Acceptance**: Round-trip fidelity on sample repo

- [ ] **BMAD import/export** (`adapters/bmad/*.ts`) **[NEW]**
  - Map PRD/architecture/stories ↔ APS steps
  - **Acceptance**: APS reflects BMAD stories accurately

- [ ] **Interop tests** (`adapters/__tests__`) **[NEW]**
  - Fixtures for SpecKit + BMAD
  - Round-trip tests, error cases

## Phase 3: CLI Foundation

### Epic: CLI Interface

#### CLI Setup

- [ ] **Add CLI dependencies**
  - [ ] Add `commander` (v12.x) - CLI framework
  - [ ] Add `chalk` (v5.x) - Colored output
  - [ ] Add `ora` (v8.x) - Loading spinners
  - [ ] Add `inquirer` (v9.x) - Interactive prompts
  - [ ] Add `fs-extra` (v11.x) - File operations
  - **Acceptance**: Dependencies installed and types available
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Create CLI directory structure**

  ```text
  cli/src/
  ├── commands/
  ├── utils/
  ├── config/
  └── index.ts
  ```

  - **Acceptance**: Directory structure matches plan
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Main entry point** (`index.ts`)
  - [ ] Add shebang `#!/usr/bin/env node`
  - [ ] Setup commander program with version
  - [ ] Register all commands
  - [ ] Add version from package.json
  - [ ] Configure help display with examples
  - **Acceptance**: CLI displays help and version correctly
  - **Date Completed**:
  - **Date Committed**:

#### Plan Command Implementation

- [ ] **Implement `anvil plan <intent>`** (`commands/plan.ts`)
  - [ ] Parse intent argument (required)
  - [ ] Validate intent length (10-500 characters)
  - [ ] Generate plan structure:
    - [ ] Create unique ID using crypto utilities
    - [ ] Set intent description
    - [ ] Initialize empty changes array
    - [ ] Add provenance data (timestamp, user, version)
    - [ ] Generate hash of plan content
  - [ ] Create `.anvil/plans/` directory if it doesn't exist
  - [ ] Save plan as JSON with pretty printing
  - [ ] Display success message with plan ID and file path
  - **Acceptance**: Can create valid plans from intent strings
  - **Dependencies**: Core APS implementation
  - **Date Completed**:
  - **Date Committed**:

#### Validate Command Implementation

- [ ] **Implement `anvil validate <plan>`** (`commands/validate.ts`)
  - [ ] Accept file path or plan ID as argument
  - [ ] Resolve plan ID to file path if needed
  - [ ] Load plan from file:
    - [ ] Support JSON format
    - [ ] Support YAML format
    - [ ] Handle file not found errors
  - [ ] Run validation:
    - [ ] Schema validation using APS validator
    - [ ] Hash verification
    - [ ] Report specific validation errors
  - [ ] Display results:
    - [ ] ✅ Green checkmark for valid plans
    - [ ] ❌ Red X for invalid plans
    - [ ] Show specific errors with context
    - [ ] Display hash verification status
  - [ ] Exit with appropriate code (0 for valid, 1 for invalid)
  - **Acceptance**: Correctly validates plans with clear feedback
  - **Dependencies**: Plan command, Core validation
  - **Date Completed**:
  - **Date Committed**:

#### Export Command Implementation

- [ ] **Implement `anvil export <plan>`** (`commands/export.ts`)
  - [ ] Accept plan ID or file path as argument
  - [ ] Options:
    - [ ] `--format <json|yaml>` (default: json)
    - [ ] `--output <path>` (default: stdout)
    - [ ] `--pretty` - Pretty print JSON output
  - [ ] Load plan using utility functions
  - [ ] Convert to requested format
  - [ ] Write to file or stdout
  - [ ] Display success message with output location
  - **Acceptance**: Can export plans in multiple formats
  - **Dependencies**: Validate command implementation
  - **Date Completed**:
  - **Date Committed**:

#### Utility Functions

- [ ] **File I/O utilities** (`utils/file-io.ts`)
  - [ ] `loadPlan(path: string): Promise<APSPlan>` - Load plan from file
  - [ ] `savePlan(plan: APSPlan, path: string): Promise<void>` - Save plan to
        file
  - [ ] `ensureDirectory(path: string): Promise<void>` - Create directory if
        needed
  - [ ] `findPlanById(id: string): Promise<string | null>` - Find plan file by
        ID
  - [ ] Handle JSON and YAML formats
  - [ ] Proper error handling for file operations
  - **Acceptance**: File operations are reliable and well-tested
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Output formatting** (`utils/output.ts`)
  - [ ] `success(message: string): void` - Green success messages
  - [ ] `error(message: string): void` - Red error messages
  - [ ] `warning(message: string): void` - Yellow warning messages
  - [ ] `info(message: string): void` - Blue info messages
  - [ ] `formatValidationErrors(errors: any[]): string` - Format validation
        errors
  - [ ] Consistent formatting across all commands
  - **Acceptance**: CLI output is colorful and user-friendly
  - **Date Completed**:
  - **Date Committed**:

#### CLI Testing

- [ ] **Plan command tests** (`commands/plan.test.ts`)
  - [ ] Plan creation with valid intent
  - [ ] Plan creation with invalid intent (too short/long)
  - [ ] ID generation uniqueness
  - [ ] File saving to correct location
  - [ ] Directory creation when needed
  - [ ] Error handling for filesystem issues
  - **Acceptance**: >95% test coverage for plan command
  - **Dependencies**: Plan command implementation
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Validate command tests** (`commands/validate.test.ts`)
  - [ ] Valid plan acceptance with success output
  - [ ] Invalid plan rejection with error details
  - [ ] File loading (JSON/YAML formats)
  - [ ] Plan ID resolution
  - [ ] Error display formatting
  - [ ] Correct exit codes
  - **Acceptance**: >95% test coverage for validate command
  - **Dependencies**: Validate command implementation
  - **Date Completed**:
  - **Date Committed**:
- [ ] **Export command tests** (`commands/export.test.ts`)
  - [ ] JSON export with pretty printing
  - [ ] YAML export with correct formatting
  - [ ] File output vs stdout
  - [ ] Option parsing
  - [ ] Error handling for missing plans
  - **Acceptance**: >95% test coverage for export command
  - **Dependencies**: Export command implementation
  - **Date Completed**:
  - **Date Committed**:

## **Phase 3.5: Provenance & Commit Trailers** **[NEW]**

### Epic: Provenance Surface

- [ ] **Commit trailers** **[NEW]**
  - Append `Anvil-APS`, `Anvil-Engine`, `Prompt-Hash` to commits
  - **Acceptance**: Trailers present on APS-driven commits

- [ ] **Provenance serializer** (`core/src/provenance/`) **[NEW]**
  - Normalise author (human/AI/hybrid), model id, timestamps, hashes
  - **Acceptance**: Stored with APS & surfaced in CLI/PR

- [ ] **Minimal provenance report** (`cli/src/commands/prov.ts`) **[NEW]**
  - Show per-plan lineage; print/export JSON
  - **Acceptance**: Report consumable in PR description

## **Phase 3.6: Agentic-Lite (Linear Orchestration) – MVP** **[NEW]**

_(Leverages the "Claude Projects Lite" style sequencing without building the
heavy sidecar. Keeps agentic optional.)_

### Epic: Linear Workflows

- [ ] **Workflow definitions** (`core/src/workflows/*.yaml`) **[NEW]**
  - e.g. `feature.yaml`: plan → code → test → review
  - **Acceptance**: Loaded and executed via CLI

- [ ] **Engine adapters (API)** (`core/src/engines/*`) **[NEW]**
  - `anthropic`, `openai`, `local` (mock)
  - **Acceptance**: Return unified diffs with rationale

- [ ] **Assisted apply** (`cli/src/commands/apply.ts`) **[NEW]**
  - Show diff, accept/skip per step; write trailers
  - **Acceptance**: Human-in-the-loop path working

- [ ] **Inline quality hooks** **[NEW]**
  - After code step, auto-run tests/lint; feed back into loop
  - **Acceptance**: Failures reported; re-try supported

## Phase 4: Gate v1

### Epic: Plan Gate Implementation

#### Gate Infrastructure

- [ ] **Create gate package structure**

  ```text
  gate/src/
  ├── runners/
  ├── checks/
  ├── evidence/
  └── index.ts
  ```

  - **Acceptance**: Gate package structure ready
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Base gate runner** (`runners/gate-runner.ts`)
  - [ ] Abstract check interface
  - [ ] Check registration system
  - [ ] Parallel check execution
  - [ ] Evidence collection
  - [ ] Summary reporting
  - **Acceptance**: Gate runner can execute multiple checks
  - **Date Completed**:
  - **Date Committed**:

#### ESLint Integration

- [ ] **ESLint check implementation** (`checks/eslint-check.ts`)
  - [ ] Programmatic ESLint API usage
  - [ ] Configuration loading from project
  - [ ] Result formatting for evidence
  - [ ] Error count and severity tracking
  - **Acceptance**: ESLint runs programmatically with results
  - **Date Completed**:
  - **Date Committed**:

#### Vitest Coverage Integration

- [ ] **Coverage check implementation** (`checks/coverage-check.ts`)
  - [ ] Vitest coverage threshold configuration
  - [ ] Changed files detection (git diff)
  - [ ] Coverage calculation for changed files only
  - [ ] Threshold enforcement
  - **Acceptance**: Coverage enforced on changed files only
  - **Date Completed**:
  - **Date Committed**:

#### Secret Scanning

- [ ] **Basic secret scanner** (`checks/secrets-check.ts`)
  - [ ] Regex patterns for common secrets
  - [ ] File content scanning
  - [ ] Allowlist/denylist support
  - [ ] SARIF output format
  - **Acceptance**: Secret scanning detects common patterns
  - **Date Completed**:
  - **Date Committed**:

#### SAST Placeholder

- [ ] **SAST check placeholder** (`checks/sast-check.ts`)
  - [ ] Placeholder implementation for future integration
  - [ ] Structured output format
  - [ ] Configuration interface
  - **Acceptance**: SAST check framework ready for implementation
  - **Date Completed**:
  - **Date Committed**:

#### Evidence System

- [ ] **Evidence bundling** (`evidence/evidence-bundle.ts`)
  - [ ] Evidence collection from all checks
  - [ ] Diff generation for proposed changes
  - [ ] Log aggregation
  - [ ] Report formatting
  - [ ] Immutable evidence appending to plans
  - **Acceptance**: Evidence is comprehensive and immutable
  - **Date Completed**:
  - **Date Committed**:

#### Gate Command

- [ ] **Implement `anvil gate <plan>`** (`cli/src/commands/gate.ts`)
  - [ ] Load plan from file or ID
  - [ ] Execute all configured checks
  - [ ] Collect evidence from checks
  - [ ] Append evidence to plan
  - [ ] Display summary table with pass/fail status
  - [ ] Exit with appropriate code
  - **Acceptance**: Gate command runs all checks and reports results
  - **Dependencies**: Gate infrastructure, All checks
  - **Date Completed**:
  - **Date Committed**:

#### Gate Testing

- [ ] **Create test fixtures**
  - [ ] Repository with passing checks
  - [ ] Repository with failing lint
  - [ ] Repository with low coverage
  - [ ] Repository with secrets
  - **Acceptance**: Test fixtures cover all check scenarios
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Integration tests** (`gate/integration.test.ts`)
  - [ ] End-to-end gate execution
  - [ ] Evidence generation verification
  - [ ] Pass/fail scenarios
  - [ ] Performance testing on realistic repositories
  - **Acceptance**: Gate works reliably on real repositories
  - **Dependencies**: Gate implementation, Test fixtures
  - **Date Completed**:
  - **Date Committed**:

## **Phase 4.5: VS Code Extension (Slim)** **[NEW]**

### Epic: Editor Experience

- [ ] **Command palette** **[NEW]**
  - "Anvil: Generate Plan", "Review Diffs", "Productionise"
  - **Acceptance**: Commands callable; show webview diff

- [ ] **Provenance decorations** **[NEW]**
  - Gutter badges (AI/human/pack)
  - **Acceptance**: Decorations reflect commit trailers

- [ ] **Engine selection** **[NEW]**
  - Quick pick: `Anthropic/OpenAI/Manual`
  - **Acceptance**: Choice applied to apply-flow

## Phase 5: OPA/Rego Integration

### Epic: Policy Engine

#### OPA Integration

- [ ] **Vendor OPA binary**
  - [ ] Download and include OPA binary for target platforms
  - [ ] Version pinning and checksum verification
  - [ ] Binary execution wrapper
  - **Acceptance**: OPA binary available and versioned
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Policy bundle structure**
  - [ ] Define policy bundle format
  - [ ] Example policy rules:
    - [ ] `coverage_min >= 80` for changed files
    - [ ] "no client-side high-risk flags"
    - [ ] Basic security policies
  - [ ] Policy versioning system
  - **Acceptance**: Policy bundle structure documented and tested
  - **Date Completed**:
  - **Date Committed**:

#### Policy Implementation

- [ ] **Policy check** (`checks/policy-check.ts`)
  - [ ] OPA binary execution
  - [ ] Policy bundle loading
  - [ ] Plan data input to OPA
  - [ ] Policy evaluation results parsing
  - [ ] Error handling for policy failures
  - **Acceptance**: Policy evaluation integrated into gate
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Policy tests** (`policy/policy.test.ts`)
  - [ ] Pass/fail fixtures for each policy rule
  - [ ] Policy rule unit tests
  - [ ] Integration tests with gate runner
  - **Acceptance**: Policy tests provide confidence in rule logic
  - **Dependencies**: Policy implementation
  - **Date Completed**:
  - **Date Committed**:

#### Sample Policies

- [ ] **Coverage policy** (`policies/coverage.rego`)
  - [ ] Minimum coverage threshold enforcement
  - [ ] Changed files only scope
  - [ ] Configurable thresholds
  - **Acceptance**: Coverage policy works with Vitest integration
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Security policies** (`policies/security.rego`)
  - [ ] Secret exposure prevention
  - [ ] High-risk flag restrictions
  - [ ] File permission checks
  - **Acceptance**: Security policies prevent common issues
  - **Date Completed**:
  - **Date Committed**:

## **Phase 5.5: GitHub PR Experience** **[NEW]**

### Epic: Reviews & Checks

- [ ] **PR description templating** **[NEW]**
  - Inject APS summary + provenance report + evidence summary
  - **Acceptance**: Template renders on PR open

- [ ] **AI PR Review comment** **[NEW]**
  - Post tagged comment (e.g., "AI Review (Claude)") with suggestions & APS
    conformance
  - **Acceptance**: Appears alongside Dependabot & humans

- [ ] **Dependabot coexistence** _(informational)_ **[NEW]**
  - Ensure no conflict with Dependabot; label segregation
  - **Acceptance**: Both comments visible, non-overlapping

## Phase 6: Sidecar Development

### Epic: Sidecar Runtime

#### Sidecar Infrastructure

- [ ] **JSON-RPC server** (`sidecar/src/server/`)
  - [ ] JSON-RPC protocol implementation
  - [ ] Plan storage and retrieval
  - [ ] Evidence writer system
  - [ ] Request/response logging
  - **Acceptance**: Sidecar responds to JSON-RPC calls
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Daemon process management**
  - [ ] Process lifecycle management
  - [ ] PID file handling
  - [ ] Graceful shutdown
  - [ ] Error recovery
  - **Acceptance**: Sidecar runs as stable daemon
  - **Date Completed**:
  - **Date Committed**:

#### Dry-run Implementation

- [ ] **Sandbox environment** (`sidecar/src/sandbox/`)
  - [ ] Network isolation
  - [ ] Temporary worktree creation
  - [ ] Environment variable masking
  - [ ] Filesystem isolation
  - **Acceptance**: Dry-run has no external effects
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Dry-run execution**
  - [ ] Plan change simulation
  - [ ] Diff generation
  - [ ] Log capture
  - [ ] Evidence bundle creation
  - **Acceptance**: Dry-run produces accurate preview
  - **Dependencies**: Sandbox environment
  - **Date Completed**:
  - **Date Committed**:

#### Sidecar Commands

- [ ] **Implement `anvil daemon start`**
  - [ ] Start sidecar process
  - [ ] Configuration loading
  - [ ] Health check endpoint
  - **Acceptance**: Daemon starts and runs stably
  - **Dependencies**: Sidecar infrastructure
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Implement `anvil dry-run <plan>`**
  - [ ] Communicate with sidecar
  - [ ] Execute dry-run via JSON-RPC
  - [ ] Display preview results
  - **Acceptance**: Dry-run shows accurate change preview
  - **Dependencies**: Dry-run implementation
  - **Date Completed**:
  - **Date Committed**:

## Phase 7: Apply & Rollback

### Epic: Plan Execution

#### Apply Implementation

- [ ] **Transactional apply system** (`sidecar/src/apply/`)
  - [ ] Atomic change application
  - [ ] Rollback point creation
  - [ ] Audit trail generation
  - [ ] Change validation before application
  - **Acceptance**: Apply operations are atomic and auditable
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Apply guards**
  - [ ] Gate approval verification
  - [ ] Plan approval verification
  - [ ] Hash integrity verification
  - [ ] Idempotency checks
  - **Acceptance**: Apply only executes approved, valid plans
  - **Date Completed**:
  - **Date Committed**:

#### Rollback Implementation

- [ ] **Rollback system** (`sidecar/src/rollback/`)
  - [ ] Previous state snapshot restoration
  - [ ] Rollback validation
  - [ ] Rollback audit trail
  - [ ] Error handling for partial rollbacks
  - **Acceptance**: Rollback reliably restores previous state
  - **Date Completed**:
  - **Date Committed**:

#### Approval System (MVP)

- [ ] **Simple approval log** (`sidecar/src/approval/`)
  - [ ] Local approval storage
  - [ ] Approval status tracking
  - [ ] Basic approval workflow
  - **Acceptance**: Plans can be approved for application
  - **Date Completed**:
  - **Date Committed**:

#### Apply/Rollback Commands

- [ ] **Implement `anvil apply <plan>`**
  - [ ] Verify plan approval and gate status
  - [ ] Execute apply via sidecar
  - [ ] Display application results
  - [ ] Handle application errors
  - **Acceptance**: Apply executes approved plans reliably
  - **Dependencies**: Apply implementation
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Implement `anvil rollback <plan>`**
  - [ ] Execute rollback via sidecar
  - [ ] Display rollback results
  - [ ] Handle rollback errors
  - **Acceptance**: Rollback restores previous state
  - **Dependencies**: Rollback implementation
  - **Date Completed**:
  - **Date Committed**:

#### E2E Testing

- [ ] **Complete workflow tests**
  - [ ] Draft → Gate → Approve → Apply → Rollback
  - [ ] Multiple plans interaction
  - [ ] Error scenarios at each stage
  - **Acceptance**: Complete workflow passes E2E tests
  - **Dependencies**: All apply/rollback implementation
  - **Date Completed**:
  - **Date Committed**:

## Phase 8: Feature Flags Pack

### Epic: Packs - Feature Flags

#### OpenFeature Integration

- [ ] **@anvil/flags library** (`packs/flags/src/`)
  - [ ] OpenFeature provider interface implementation
  - [ ] Provider adapter pattern
  - [ ] TypeScript type definitions
  - **Acceptance**: Library implements OpenFeature standard
  - **Date Completed**:
  - **Date Committed**:

- [ ] **File store provider**
  - [ ] `flags.env.json` file format
  - [ ] Environment variable overrides
  - [ ] Flag evaluation logic
  - [ ] Default value handling
  - **Acceptance**: Flags work with file store
  - **Date Completed**:
  - **Date Committed**:

#### CLI Integration

- [ ] **Flag management commands**
  - [ ] `anvil flags add <name> <default-value>` - Add new flag
  - [ ] `anvil flags set <name> <value>` - Set flag value
  - [ ] `anvil flags list` - List all flags
  - [ ] `anvil flags remove <name>` - Remove flag
  - **Acceptance**: Flags can be managed via CLI
  - **Date Completed**:
  - **Date Committed**:

- [ ] **APS delta generation**
  - [ ] Flag operations generate APS changes
  - [ ] Changes integrated with plan system
  - [ ] Validation of flag operations
  - **Acceptance**: Flag changes go through plan system
  - **Dependencies**: CLI integration
  - **Date Completed**:
  - **Date Committed**:

#### Generated Assets

- [ ] **Test generation**
  - [ ] Automated flag test creation
  - [ ] Test templates for different flag types
  - [ ] Integration with project test suite
  - **Acceptance**: Flag tests generated automatically
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Documentation generation**
  - [ ] Flag documentation templates
  - [ ] Usage examples
  - [ ] Integration documentation
  - **Acceptance**: Flag documentation generated
  - **Date Completed**:
  - **Date Committed**:

#### Flag Policies

- [ ] **Client-side risk policy**
  - [ ] Policy rule for high-risk client-side flags
  - [ ] Risk level classification
  - [ ] Policy enforcement in gate
  - **Acceptance**: Policy prevents risky flag configurations
  - **Dependencies**: Policy engine
  - **Date Completed**:
  - **Date Committed**:

#### FeatureBoard Preparation

- [ ] **FeatureBoard provider stub** (`providers/featureboard/`)
  - [ ] Stub implementation with unimplemented methods
  - [ ] Adapter test framework
  - [ ] Migration preparation
  - **Acceptance**: FeatureBoard adapter ready for implementation
  - **Date Completed**:
  - **Date Committed**:

## Phase 9: Productioniser

### Epic: Repository Governance

#### Scanning System

- [ ] **Repository scanner** (`productioniser/src/scanner/`)
  - [ ] Test coverage analysis
  - [ ] Documentation presence checking
  - [ ] Lint configuration verification
  - [ ] Folder structure hygiene
  - [ ] Dependency security scanning
  - **Acceptance**: Scanner identifies improvement opportunities
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Heuristics engine**
  - [ ] Safe-by-default recommendations
  - [ ] Context-aware suggestions
  - [ ] Risk assessment for recommendations
  - **Acceptance**: Heuristics provide valuable suggestions
  - **Date Completed**:
  - **Date Committed**:

#### Remediation System

- [ ] **Plan generator** (`productioniser/src/generator/`)
  - [ ] APS plan generation from scan results
  - [ ] Scaffolding suggestions
  - [ ] Configuration improvements
  - [ ] Security enhancement recommendations
  - **Acceptance**: Generator creates valid remediation plans
  - **Dependencies**: Scanning system
  - **Date Completed**:
  - **Date Committed**:

#### Productioniser Command

- [ ] **Implement `anvil productionise`**
  - [ ] Repository scanning execution
  - [ ] Remediation plan generation
  - [ ] Plan saving and display
  - [ ] Options for scan scope
  - **Acceptance**: Command outputs useful remediation plan
  - **Dependencies**: Scanning and remediation systems
  - **Date Completed**:
  - **Date Committed**:

#### Testing

- [ ] **Fixture repositories**
  - [ ] Repository with missing tests
  - [ ] Repository with poor documentation
  - [ ] Repository with security issues
  - [ ] Well-maintained repository
  - **Acceptance**: Fixtures cover scan scenarios
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Productioniser tests**
  - [ ] Scan accuracy tests
  - [ ] Plan generation tests
  - [ ] Performance tests on large repositories
  - **Acceptance**: Productioniser works reliably
  - **Dependencies**: Fixture repositories
  - **Date Completed**:
  - **Date Committed**:

## Phase 10: GitHub Integration

### Epic: CI/CD Integration

#### GitHub Action

- [ ] **Action template** (`.github/actions/anvil-gate/`)
  - [ ] Action metadata (action.yml)
  - [ ] Action implementation (JavaScript/Docker)
  - [ ] Input/output configuration
  - [ ] Error handling and reporting
  - **Acceptance**: Action runs anvil gate on PRs
  - **Date Completed**:
  - **Date Committed**:

- [ ] **PR blocking logic**
  - [ ] Gate failure blocks merge
  - [ ] Success annotation on PR
  - [ ] Failure details in PR comments
  - [ ] Re-run capabilities
  - **Acceptance**: PRs blocked when gate fails
  - **Dependencies**: GitHub Action
  - **Date Completed**:
  - **Date Committed**:

#### Sample Repository

- [ ] **Sample application** (`examples/sample-app/`)
  - [ ] Application using @anvil/flags
  - [ ] Complete CI/CD setup
  - [ ] Documentation and examples
  - [ ] Demonstration workflows
  - **Acceptance**: Sample app demonstrates full workflow
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Demo scenarios**
  - [ ] Successful PR with passing gate
  - [ ] Failed PR with gate failures
  - [ ] Flag management demonstration
  - [ ] Rollback demonstration
  - **Acceptance**: All demo scenarios work
  - **Dependencies**: Sample application
  - **Date Completed**:
  - **Date Committed**:

#### Integration Testing

- [ ] **GitHub workflow tests**
  - [ ] Action execution tests
  - [ ] PR blocking verification
  - [ ] Comment generation tests
  - **Acceptance**: GitHub integration works reliably
  - **Dependencies**: GitHub Action, Sample repository
  - **Date Completed**:
  - **Date Committed**:

## Phase 11: Hardening & Documentation

### Epic: Production Readiness

#### Security Hardening

- [ ] **Enhanced secret patterns**
  - [ ] Expanded regex patterns
  - [ ] ML-based secret detection (optional)
  - [ ] Custom pattern configuration
  - **Acceptance**: Secret detection has low false positive rate
  - **Date Completed**:
  - **Date Committed**:

- [ ] **SARIF output implementation**
  - [ ] SARIF format for all scanners
  - [ ] GitHub integration for annotations
  - [ ] Tool interoperability
  - **Acceptance**: SARIF output works with security tools
  - **Date Completed**:
  - **Date Committed**:

#### Performance Optimization

- [ ] **Gate performance**
  - [ ] Parallel check execution
  - [ ] Caching for repeated runs
  - [ ] Incremental analysis
  - **Acceptance**: Gate runs efficiently on large repositories
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Memory optimization**
  - [ ] Efficient data structures
  - [ ] Memory leak prevention
  - [ ] Resource cleanup
  - **Acceptance**: Memory usage remains stable
  - **Date Completed**:
  - **Date Committed**:

#### Documentation

- [ ] **Developer documentation** (`docs/`)
  - [ ] Installation guide
  - [ ] Configuration reference
  - [ ] API documentation
  - [ ] Troubleshooting guide
  - **Acceptance**: Documentation is comprehensive and clear
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Policy cookbook**
  - [ ] Common policy examples
  - [ ] Policy writing guide
  - [ ] Best practices
  - **Acceptance**: Users can write effective policies
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Contribution guide**
  - [ ] Development setup
  - [ ] Testing guidelines
  - [ ] Code review process
  - [ ] Release process
  - **Acceptance**: Contributors can easily get started
  - **Date Completed**:
  - **Date Committed**:

## Phase 12: Release Candidate

### Epic: Release Preparation

#### Release Engineering

- [ ] **Version management**
  - [ ] Semantic versioning implementation
  - [ ] Changelog generation
  - [ ] Version bumping automation
  - **Acceptance**: Versions are managed consistently
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Artifact signing**
  - [ ] Package signing setup
  - [ ] Checksum generation
  - [ ] Provenance documentation
  - **Acceptance**: Artifacts are signed and verifiable
  - **Date Completed**:
  - **Date Committed**:

#### Release Documentation

- [ ] **Day-0 runbook**
  - [ ] Initial deployment guide
  - [ ] Configuration recommendations
  - [ ] Common issues and solutions
  - **Acceptance**: Teams can deploy Anvil quickly
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Incident procedures**
  - [ ] Rollback procedures
  - [ ] Debugging guides
  - [ ] Support escalation
  - **Acceptance**: Operations team can handle incidents
  - **Date Completed**:
  - **Date Committed**:

#### Release Testing

- [ ] **End-to-end validation**
  - [ ] Complete workflow testing
  - [ ] Performance benchmarking
  - [ ] Security validation
  - [ ] Cross-platform testing
  - **Acceptance**: Release candidate is production-ready
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Sample walkthrough recording**
  - [ ] Video demonstration
  - [ ] Documentation walkthrough
  - [ ] Best practices showcase
  - **Acceptance**: Users have clear guidance for getting started
  - **Date Completed**:
  - **Date Committed**:

#### Release Candidate

- [ ] **RC tag creation**
  - [ ] Tag with RC version
  - [ ] Release notes generation
  - [ ] Artifact publication
  - **Acceptance**: RC is available for testing
  - **Dependencies**: All release preparation
  - **Date Completed**:
  - **Date Committed**:

## Higher-Level Tasks for Future Phases

### Epic: Advanced Features (Post-MVP)

- [ ] **Rust/Go worker for performance**
  - [ ] High-performance scanning implementation
  - [ ] CLI rewrite for speed
  - **Date Completed**:
  - **Date Committed**:

- [ ] **React dashboard**
  - [ ] Plan approval interface
  - [ ] History visualization
  - [ ] Real-time status
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Additional Packs**
  - [ ] Observability pack
  - [ ] Telemetry enrichment pack
  - [ ] Infrastructure pack
  - **Date Completed**:
  - **Date Committed**:

### Epic: Enterprise Features (Future)

- [ ] **Multi-language support**
  - [ ] Python ecosystem integration
  - [ ] Java/Kotlin support
  - [ ] Go module support
  - **Date Completed**:
  - **Date Committed**:

- [ ] **Enterprise integrations**
  - [ ] SSO authentication
  - [ ] RBAC authorization
  - [ ] Audit logging
  - [ ] Compliance reporting
  - **Date Completed**:
  - **Date Committed**:

## Future Phases – Advanced / Enterprise

- **Memory Layer (RAG + provenance store)** **[NEW]**
  - [ ] Vector store + metadata indices for APS, ADRs, code artefacts
  - [ ] Retrieval tools for agents and Productioniser
  - **Acceptance**: Agents cite sources; PR shows citations summary

- **MCP façade (agentic interop)** **[NEW]**
  - [ ] Expose APS/gate/productionise as MCP tools
  - **Acceptance**: Cursor/Claude Projects can call Anvil natively

- **Packs Marketplace** **[NEW]**
  - [ ] Install/upgrade/version packs; publishing flow
  - **Acceptance**: Pack install via CLI + provenance

## Definition of Done

Each task is considered complete when:

- [ ] Implementation meets acceptance criteria
- [ ] Unit tests achieve >90% coverage
- [ ] Integration tests pass
- [ ] Code review completed
- [ ] Documentation updated
- [ ] CHANGELOG entry added
- [ ] PR passes all CI checks

## Progress Tracking Template

### Daily Standup

- **Yesterday**: Tasks completed
- **Today**: Tasks in progress
- **Blockers**: Issues preventing progress

### Weekly Review

- **Tasks Completed**: Count and list
- **Tasks In Progress**: Current status
- **Tasks Blocked**: Issues and resolution plans
- **Next Week Goals**: Planned deliverables

For strategic context and architectural decisions, see [PLAN.md](./PLAN.md).

## Notes on MVP Cut (practical)

- **Ship first:** Phase 2, 2.5, 3, 3.5, 3.6, 4, 4.5, 5.5, and the **Feature
  Flags Pack** subset; plus a **minimal Productioniser** that wraps
  tests/docs/telemetry + secret scan.
- **Defer:** Sidecar, full transactional apply/rollback, deep OPA policies, full
  Productioniser heuristics, memory layer, MCP façade, marketplace.

If you want, I can convert this into **issue templates and GitHub project
boards** (one board per phase, labels auto-applied), or drop this into canvas as
a living checklist you can update with your team.
