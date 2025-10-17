# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is an Nx monorepo workspace for JavaScript/TypeScript packages. The
workspace is configured to manage multiple packages under the `packages/`
directory using Nx build system and uses pnpm for package management.

## Commands

### Install dependencies

```sh
pnpm install
```

### Build commands

```sh
# Build a specific package
npx nx build <package-name>

# Build all packages
pnpm build

# Build with pnpm directly
pnpm --filter <package-name> build
```

### Testing

```sh
# Run unit tests with Vitest
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run E2E tests with Playwright
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

### Linting and formatting

```sh
# Lint and fix issues
pnpm lint

# Check linting without fixing
pnpm lint:check

# Format code with Prettier
pnpm format

# Check formatting without fixing
pnpm format:check
```

### Type checking

```sh
# Type check entire workspace
pnpm typecheck

# Type check specific package
npx nx typecheck <package-name>

# Type check with pnpm directly
pnpm --filter <package-name> typecheck
```

### Generate a new library package

```sh
npx nx g @nx/js:lib packages/<package-name> --publishable --importPath=@anvil/<package-name>
```

### Sync TypeScript project references

```sh
npx nx sync
```

### Check TypeScript references in CI

```sh
npx nx sync:check
```

### Release packages

```sh
npx nx release
```

Add `--dry-run` to preview changes without releasing.

### Explore project graph

```sh
npx nx graph
```

## Architecture

- **Monorepo structure**:
  - `cli/` - Command-line interface application
  - `ui/` - User interface components
  - `core/` - Shared core functionality (APS schema, validation, hashing)
  - `gate/` - Quality gate checks (lint, test, coverage, secrets)
  - `packages/adapters/` - Format adapters (SpecKit ✅, BMAD planned)
  - `packs/` - Package bundles (future: feature flags, telemetry)
  - `packages/` - Additional library packages
  - `e2e/` - End-to-end tests using Playwright
  - `docs/` - Project documentation
- **Build system**: Nx with TypeScript plugin for automatic task inference
- **TypeScript configuration**:
  - Base config in `tsconfig.base.json` with strict mode enabled
  - Uses TypeScript project references for better build performance
  - Configured for Node.js ES2022 with ES modules
  - Each app folder has its own `tsconfig.json` with project references
- **Package management**: Uses pnpm workspaces (defined in
  `pnpm-workspace.yaml`)
- **Testing frameworks**:
  - Unit testing: Vitest with coverage support
  - E2E testing: Playwright
- **Code quality tools**:
  - ESLint with TypeScript support (configured in `eslint.config.mjs`)
  - Prettier for code formatting
  - Husky for Git hooks
  - Lint-staged for pre-commit checks
- **Nx plugins**: Currently using `@nx/js/typescript` plugin for automatic
  TypeScript build and typecheck targets

## Development Workflow

1. Core shared functionality goes in `core/` (APS schema, validation, utilities)
2. Format adapters go in `packages/adapters/` (SpecKit, BMAD, etc.)
3. Quality gate checks go in `gate/` (lint, test, coverage, secrets)
4. CLI application code goes in `cli/` (commands, UI, orchestration)
5. UI components go in `ui/`
6. Package bundles go in `packs/` (future: feature flags, telemetry)
7. Additional libraries can be created under `packages/`
8. All packages use `@anvil/*` namespace
9. TypeScript project references ensure proper build order
10. Dependencies between packages use `workspace:*` protocol

## Current Implementation Status (as of October 16, 2025)

### ✅ Completed Components

1. **APS Core** (`packages/core/`)
   - Zod schema with full TypeScript types
   - Deterministic hashing (SHA-256)
   - Validation engine
   - Comprehensive test coverage

2. **Adapter Framework** (`packages/adapters/src/base/`)
   - FormatAdapter interface
   - AdapterRegistry with auto-detection
   - Testing utilities
   - ~586 LOC, 22 tests (100% passing)

3. **SpecKit Adapter** (`packages/adapters/src/speckit/`)
   - Complete implementation for GitHub's official spec-kit format
   - Support for spec.md, plan.md, and tasks.md
   - V1 (simple) and V2 (official) format parsers
   - Import and export adapters
   - ~2,469 LOC, 51 tests (49 passing, 2 minor fixes pending)

4. **Gate v1** (`packages/gate/`)
   - ESLint integration
   - Test coverage checks
   - Secret scanning
   - Evidence collection

### ⏳ In Progress

1. **BMAD Adapter** (Week 5-6 target)
   - PRD/architecture document format
   - Requirement extraction (REQ-XXX format)

### 📋 Planned

1. CLI integration with adapter auto-detection
2. Policy engine (OPA/Rego)
3. Sidecar (dry-run, apply, rollback)
4. GitHub Action integration

## Package Structure

```
packages/
├── core/                      # @anvil/core
│   ├── src/
│   │   ├── schema/           # APS Zod schema
│   │   ├── hash/             # Deterministic hashing
│   │   ├── validation/       # Validation engine
│   │   └── index.ts
│   └── README.md
├── adapters/                  # @anvil/adapters
│   ├── src/
│   │   ├── base/             # Framework core (586 LOC)
│   │   │   ├── types.ts      # FormatAdapter interface
│   │   │   ├── registry.ts   # Adapter registry
│   │   │   ├── utils.ts      # Utilities
│   │   │   └── testing.ts    # Test helpers
│   │   ├── speckit/          # SpecKit adapter (2,469 LOC) ✅
│   │   │   ├── parser.ts     # Core parser
│   │   │   ├── import.ts     # V1 import
│   │   │   ├── import-v2.ts  # V2 import
│   │   │   ├── export.ts     # Export adapter
│   │   │   └── parsers/      # Specialized parsers
│   │   └── bmad/             # BMAD adapter (planned) ⏳
│   └── README.md
└── gate/                      # @anvil/gate
    ├── src/
    │   ├── checks/           # Individual gate checks
    │   ├── runner.ts         # Gate runner
    │   └── index.ts
    └── README.md
```

## Key Documentation Files

- `ARCHITECTURE.md` - Detailed system architecture and design decisions
- `PLAN.md` - Strategic plan and three-act vision
- `TODO.md` - Comprehensive implementation task list with progress tracking
- `ROADMAP.md` - High-level milestones and phases
- `packages/adapters/README.md` - Adapter framework documentation
- `packages/core/docs/` - APS core API documentation
