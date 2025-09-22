# Anvil

[![CI](https://github.com/EddaCraft/anvil-001/actions/workflows/ci.yml/badge.svg)](https://github.com/EddaCraft/anvil-001/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/EddaCraft/anvil-001/branch/main/graph/badge.svg)](https://codecov.io/gh/EddaCraft/anvil-001)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Nx](https://img.shields.io/badge/Nx-21.5.2-143055.svg?style=flat-square)](https://nx.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern monorepo workspace powered by Nx, pnpm, and TypeScript.

## 📊 Project Status

| Phase                   | Status         | Progress          |
| ----------------------- | -------------- | ----------------- |
| Phase 1: Infrastructure | ✅ Complete    | 100%              |
| Phase 2: APS Core       | 🚧 In Progress | 0%                |
| Phase 3: CLI Foundation | ⏳ Planned     | 0%                |
| Phase 4: Gate v1        | ⏳ Planned     | 0%                |
| Phase 5: OPA/Rego       | ⏳ Planned     | 0%                |
| **Overall Progress**    | **~4%**        | **14/300+ tasks** |

See [TODO.md](./TODO.md) for detailed task tracking and [PLAN.md](./PLAN.md) for the strategic roadmap.

## 🚀 Features

- **Monorepo Structure**: Organized workspace with `cli/`, `ui/`, `core/`, and `packs/` packages
- **TypeScript**: Full TypeScript support with project references
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks
- **CI/CD**: GitHub Actions workflow with caching and matrix testing
- **Developer Experience**: Fast builds with Nx, efficient package management with pnpm

## 📦 Project Structure

```
anvil/
├── cli/          # Command-line interface application
├── ui/           # User interface components
├── core/         # Shared core functionality
├── packs/        # Package bundles
├── packages/     # Additional library packages
└── e2e/          # End-to-end tests
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x, 20.x, or 22.x
- pnpm 10.16.1 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## 📜 Available Scripts

### Development

```bash
# Run tests
pnpm test              # Run unit tests
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Run tests with coverage
pnpm test:e2e          # Run Playwright E2E tests

# Code quality
pnpm lint              # Lint and fix code
pnpm lint:check        # Check linting issues
pnpm format            # Format code with Prettier
pnpm format:check      # Check formatting issues
pnpm typecheck         # Type check with TypeScript

# Build
pnpm build             # Build all packages
```

### Nx Commands

```bash
# Generate a new library
npx nx g @nx/js:lib packages/<name> --publishable --importPath=@anvil/<name>

# Run specific package commands
npx nx build <package-name>
npx nx test <package-name>

# Dependency graph
npx nx graph

# Run affected commands
npx nx affected -t lint
npx nx affected -t test
npx nx affected -t build
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
pnpm test
```

Tests are located next to source files with `.test.ts` or `.spec.ts` extensions.

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

E2E tests are located in the `e2e/` directory.

## 🔧 Configuration

### TypeScript

- Base configuration: `tsconfig.base.json`
- Project references configured for each package
- Strict mode enabled

### ESLint

- Configuration: `eslint.config.mjs`
- TypeScript support with `@typescript-eslint`
- Prettier integration

### Prettier

- Configuration: `.prettierrc`
- Consistent code formatting across the project

### Git Hooks (Husky)

- Pre-commit: Runs lint-staged for changed files
- Automatic formatting and linting before commits

## 🚀 CI/CD

GitHub Actions workflow includes:

- **Matrix Testing**: Tests against Node.js 18.x, 20.x, and 22.x
- **Caching**: pnpm store cached for faster builds
- **Parallel Jobs**: Lint, test, and build run efficiently
- **Coverage Reports**: Uploaded as artifacts
- **E2E Tests**: Playwright tests with report uploads
- **Nx Affected**: Runs only affected project tasks

## 📚 Learn More

- [Nx Documentation](https://nx.dev)
- [pnpm Documentation](https://pnpm.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`pnpm test`)
2. Code is properly formatted (`pnpm format`)
3. No linting errors (`pnpm lint:check`)
4. TypeScript compiles without errors (`pnpm typecheck`)

## 💡 Nx Console

For an enhanced development experience, install the Nx Console extension for your IDE:

- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [IntelliJ Plugin](https://plugins.jetbrains.com/plugin/15000-nx-console)

## 🔗 Useful Links

- [Nx Cloud](https://nx.app) - Distributed caching and task execution
- [Nx Plugins](https://nx.dev/concepts/nx-plugins) - Extend Nx capabilities
- [Nx CI Setup](https://nx.dev/ci/intro/ci-with-nx) - Optimize CI pipelines
