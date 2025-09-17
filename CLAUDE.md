# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx monorepo workspace for JavaScript/TypeScript packages. The workspace is configured to manage multiple packages under the `packages/` directory using Nx build system and uses pnpm for package management.

## Commands

### Install dependencies

```sh
pnpm install
```

### Build a package

```sh
npx nx build <package-name>
# or directly with pnpm:
pnpm --filter <package-name> build
```

### Run type checking

```sh
npx nx typecheck <package-name>
# or directly with pnpm:
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
  - `core/` - Shared core functionality
  - `packs/` - Package bundles
  - `packages/` - Additional library packages
- **Build system**: Nx with TypeScript plugin for automatic task inference
- **TypeScript configuration**:
  - Base config in `tsconfig.base.json` with strict mode enabled
  - Uses TypeScript project references for better build performance
  - Configured for Node.js ES2022 with ES modules
  - Each app folder has its own `tsconfig.json` with project references
- **Package management**: Uses pnpm workspaces (defined in `pnpm-workspace.yaml`)
- **Nx plugins**: Currently using `@nx/js/typescript` plugin for automatic TypeScript build and typecheck targets

## Development Workflow

1. Core shared functionality goes in `core/`
2. CLI application code goes in `cli/`
3. UI components go in `ui/`
4. Package bundles go in `packs/`
5. Additional libraries can be created under `packages/`
6. All packages use `@anvil/*` namespace
7. TypeScript project references ensure proper build order
8. Dependencies between packages use `workspace:*` protocol
