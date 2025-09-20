# Anvil Project TODO - Updated Status

## Project Overview
Anvil is a deterministic development automation platform that enforces quality gates and manages infrastructure-as-code through validated, reproducible plans.

## Current Status Summary

### ✅ **Phase 0 — Repo & Toolchain (COMPLETED)**
- [x] Bootstrap monorepo with Nx workspace and pnpm workspaces
- [x] TypeScript 5.x, ESLint + Prettier, Vitest, Playwright configured
- [x] GitHub Actions CI/CD with pnpm lint && pnpm test, status badge + caching

### 🚧 **Phase 1 — APS & Canonicalisation (PARTIALLY DONE)**
- [ ] Drop in the APS Zod schema you've written
- [ ] Add canonicalisation + hashing helper
- [ ] Create core/aps/tests/ with golden files (same input → same hash)
- [ ] Export JSON Schema from Zod → dist/aps.schema.json

### 🚧 **Phase 2 — CLI Skeleton (PARTIALLY DONE)**
- [x] Initialise cli/ package with Commander
- [ ] Commands:
  - [ ] anvil plan <intent> → stub APS draft
  - [ ] anvil validate <plan> → check schema + hash
  - [ ] anvil export <plan> → save to JSON/YAML
- [ ] Unit test each command with Vitest

### ✅ **Phase 3 — Plan Gate (COMPLETED)**
- [x] Implement Gate runner in core/gate/
- [x] Integrate:
  - [x] ESLint (lint)
  - [x] Vitest coverage thresholds
  - [x] Secret scan (regex first)
  - [x] Dummy SAST placeholder
- [x] Hook Gate into CLI: anvil gate <plan>
- [x] Write tests: passing repo, failing repo (secrets, low coverage)

### ❌ **Phase 4 — Sidecar Runtime (NOT STARTED)**
- [ ] Build sidecar/ process: Node runtime that runs APS apply/dry-run
- [ ] CLI commands:
  - [ ] anvil apply <plan>
  - [ ] anvil rollback <plan>
- [ ] Use APS evidence field to capture logs/diffs from dry-run
- [ ] Write integration test: draft → gate → apply → rollback

### ❌ **Phase 5 — Packs (NOT STARTED)**
- [ ] Implement pack loader (anvil pack add <name>)
- [ ] MVP Packs:
  - [ ] Feature Flags scaffold
  - [ ] Telemetry Lite (logging)
- [ ] Packs emit APS patches, not direct writes
- [ ] Test: install pack → APS updates → plan applies cleanly

### ❌ **Phase 6 — Productioniser (NOT STARTED)**
- [ ] Add repo scanner: check for missing tests, docs, lint config
- [ ] CLI: anvil productionise <repo> → emits APS remediation plan
- [ ] Unit test with "toy repo" fixtures

### ❌ **Phase 7 — Integrations & DX (NOT STARTED)**
- [ ] GitHub Action: run anvil gate in PRs
- [ ] Dashboard (stretch):
  - [ ] React + Vite app to list APS plans
  - [ ] Approve/reject UI
- [ ] VSCode extension (stretch): inline APS previews

## Cross-Cutting TODOs

- [ ] Versioning: bake schema_version into APS
- [ ] OPA/Rego policies: stub bundle for Plan Gate (optional in MVP)
- [ ] Docs:
  - [ ] Developer guide: APS, CLI usage
  - [ ] Contribution guide: how to add a Pack

## Success Markers

You can run:
- [ ] anvil plan "add feature flag"
- [ ] anvil gate plan.json
- [ ] anvil apply plan.json
- [ ] anvil rollback plan.json

All actions pass through APS validation + hash.
Evidence is stored deterministically.
At least one Pack works end-to-end.
GitHub Action enforces gate before merge.

## Key Gaps Identified

1. **APS Schema**: The core APS (Anvil Plan Spec) schema is completely missing - this is the foundation of the entire system
2. **Plan Commands**: The basic plan creation, validation, and export commands are missing
3. **Hash Generation**: No deterministic hashing system for plan integrity
4. **Sidecar Runtime**: No apply/rollback functionality
5. **Packs System**: No modular pack system
6. **Productioniser**: No repo scanning and remediation

## Recommendations

The project has a solid foundation with the monorepo setup, CI/CD, and gate system, but is missing the core APS specification and basic plan management commands. 

**Immediate Priority**: Implement the APS schema and basic plan commands (plan, validate, export)
**Next**: Add the sidecar runtime for apply/rollback functionality
**Then**: Build out the packs system for modularity

The gate system is well-implemented and tested, which is great - it can be used as a reference for the quality of implementation needed for the other components.

## Current Implementation Details

### What's Working
- Monorepo structure with Nx workspace
- Comprehensive CI/CD pipeline
- Gate system with ESLint, coverage, and secret scanning
- Well-tested gate runner with integration tests
- CLI framework with Commander.js
- TypeScript configuration and tooling

### What's Missing
- APS (Anvil Plan Spec) schema definition
- Plan creation, validation, and export commands
- Deterministic hashing system
- Sidecar runtime for apply/rollback
- Packs system for modularity
- Productioniser for repo scanning

---

*Last updated: $(date)*