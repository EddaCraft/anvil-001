# Anvil Strategic Plan

## Project Mission

**Mission**: Ship an MVP sidecar/forge that converts human/AI intent into
deterministic plans (APS), gates them through one quality bar, and applies or
rolls back with evidence.

Anvil is a deterministic development automation platform that enforces quality
gates and manages infrastructure-as-code through validated, reproducible plans.
The platform sits beside the development flow and acts as an arbiter for all
changes, ensuring consistency, quality, and auditability.

## Success Criteria

We're "done" when:

- A developer can run:

  ```bash
  anvil plan "add feature flag"
  anvil gate plan.json
  anvil apply plan.json
  anvil rollback plan.json
  ```

- Plans are hash-stable and validated by Zod; evidence is appended immutably
- Plan Gate enforces lint, tests, coverage threshold, secrets scan, and at least
  one policy rule
- Packs work end-to-end, starting with OpenFeature flags (swap-capable to
  FeatureBoard)
- GitHub Action blocks merges that fail the Gate

## Architecture Overview

```text
Dev/IDE/Agent → APS draft (Zod) → Sidecar dry-run → Evidence
                      ↓                    ↓
                 Plan Gate (lint/tests/coverage/secrets/policy)
                      ↓
               Approve → Apply → Audit trail → Rollback
```

### Technical Architecture

- **Language**: TypeScript everywhere; option to add systems binary later
  (Go/Rust) for heavy scanning—post-MVP
- **Policy**: OPA/Rego evaluated by the Gate; rules live in a bundle versioned
  with the repo
- **Packs**: Emit APS deltas (never direct file writes)
- **Storage**: Plans stored in `.anvil/plans/` with immutable evidence appended
- **Security**: No direct writes from agents/IDEs; only via validated plans

## Epics

### Epic 1: APS Core

**Goal**: Establish the foundational plan specification and validation system

**Components**:

- Zod schema with branding + enums; schema_version literal
- Canonicalization + hash generation; stable stringify; SHA-256
- JSON Schema export; CI artifact
- TypeScript types and validation utilities
- Nice error mapping for CLI users

**Success Metrics**:

- Golden tests for hash determinism pass
- Schema validates all plan types
- Hash generation is reproducible across environments
- Error messages are clear and actionable

**Dependencies**: None (foundational)

### Epic 2: CLI Interface

**Goal**: Provide developer-friendly command-line interface for plan management

**Components**:

- `plan <intent>` command with provenance stubs
- `validate`, `export` commands (JSON/YAML)
- Plan storage under `.anvil/plans/`
- Pretty printer for plans
- Interactive prompts and colored output

**Success Metrics**:

- All CLI commands functional with proper error handling
- User experience is intuitive and fast
- Plans can be created, validated, and exported reliably

**Dependencies**: Epic 1 (APS Core)

### Epic 3: Plan Gate

**Goal**: Enforce quality standards through automated checks

**Components**:

- ESLint integration (programmatic)
- Vitest + coverage threshold for changed files
- Secrets scan (regex + denylist/allowlist)
- SAST placeholder with structured output
- Evidence bundling (diff/log/report)
- Exit codes & summary table

**Success Metrics**:

- Gate runs reliably on real repositories
- False positive rate < 5%
- Clear pass/fail indicators with actionable feedback
- Coverage > 85% on gate components

**Dependencies**: Epic 2 (CLI Interface)

### Epic 4: OPA/Rego Policy Engine

**Goal**: Enable custom policy enforcement through code

**Components**:

- Vendor OPA binary; version pin
- Policy bundle structure; example rules
- Policy tests (pass/fail fixtures)
- CLI gate includes policy step
- Sample policies for common scenarios

**Success Metrics**:

- Policy evaluation integrated into gate
- Rule tests provide confidence in policy logic
- Policy updates can be versioned with repo

**Dependencies**: Epic 3 (Plan Gate)

### Epic 5: Sidecar Runtime

**Goal**: Long-running process for plan execution and state management

**Components**:

- JSON-RPC server; plan store; evidence writer
- Dry-run sandbox (no network; temp worktree)
- Apply transactional writes + audit
- Rollback previous snapshot; idempotency
- Approvals model (simple local log for MVP)

**Success Metrics**:

- Dry-run produces accurate preview of changes
- Apply/rollback operations are reliable and atomic
- Evidence trail is complete and immutable

**Dependencies**: Epic 4 (OPA/Rego)

### Epic 6: Packs - Feature Flags

**Goal**: Modular feature delivery starting with flags

**Components**:

- `@anvil/flags` provider interface; OpenFeature provider
- File store (flags.env.json) + env overrides
- CLI flags add/set → APS deltas
- Generated tests and docs
- Policy: no client-side high-risk flags
- Stub FeatureBoardProvider + adapter tests

**Success Metrics**:

- Feature flags can be managed via plans
- OpenFeature integration works end-to-end
- Flag policies prevent risky configurations

**Dependencies**: Epic 5 (Sidecar Runtime)

### Epic 7: Productioniser

**Goal**: Automated repository governance and remediation

**Components**:

- Scanner (tests/docs/lint presence; folder hygiene)
- Remediation plan generator (APS)
- Fixture repos + assertions
- Heuristics for safe defaults

**Success Metrics**:

- Productioniser identifies real improvement opportunities
- Generated remediation plans are valid and useful
- Scanner runs efficiently on large repositories

**Dependencies**: Epic 6 (Packs)

### Epic 8: Integrations & Developer Experience

**Goal**: Seamless integration with existing workflows

**Components**:

- GitHub Action: Gate on PR
- Sample repo demonstrating flags
- Minimal dashboard (optional): plan list + approve
- Documentation and examples

**Success Metrics**:

- GitHub Action blocks PRs that fail gate
- Sample repo demonstrates full workflow
- Developer onboarding is smooth and fast

**Dependencies**: Epic 7 (Productioniser)

### Epic 9: Quality & Security

**Goal**: Production-ready quality and security standards

**Components**:

- Coverage > 85% on core/gate
- SARIF outputs for scans
- Supply-chain: npm audit, pnpm lockfile pinned, provenance note
- Hardening and performance optimization

**Success Metrics**:

- Security scans pass CI
- Performance is acceptable on large repositories
- Code quality meets production standards

**Dependencies**: Epic 8 (Integrations)

## Phases and Milestones

### Phase 1: Foundations (Weeks 1-2)

**Milestone**: Repository boots green in CI

- Nx monorepo + pnpm workspaces setup
- CI: lint + test workflow; status badge; Node versions pinned
- Core folder structure established

### Phase 2: APS Spine (Weeks 3-4)

**Milestone**: Schema version 0.1.0 locked; pnpm core:test stable

- APS Zod schema implementation
- Canonicalization + hash generation
- Golden tests (same input → same hash)

### Phase 3: CLI Foundation (Weeks 5-6)

**Milestone**: Create/validate/export plan locally

- `anvil plan`, `validate`, `export` commands
- Persist plans to `.anvil/plans/`
- Proper error handling and user experience

### Phase 4: Gate v1 (Weeks 7-8)

**Milestone**: Passing and failing repo fixtures; clear output

- Gate runner with ESLint + Vitest coverage + secrets (regex) + SAST placeholder
- Gate result appended to plan evidence

### Phase 5: OPA/Rego Integration (Weeks 9-10)

**Milestone**: Policy pass/fail reflected in evidence; rule tests included

- Bundle OPA with sample policy rules
- Coverage minimum enforcement
- Client-side flag risk policies

### Phase 6: Sidecar Development (Weeks 11-12)

**Milestone**: `anvil dry-run plan.json` produces diff + logs

- Daemon process implementation
- Dry-run creates evidence bundle
- Immutable evidence appending

### Phase 7: Apply & Rollback (Weeks 13-14)

**Milestone**: Draft → Gate → Approve → Apply → Rollback E2E test green

- Idempotent apply with audit record
- Rollback to previous state
- Guard: apply only if Gate passed and plan approved

### Phase 8: Feature Flags Pack (Weeks 15-16)

**Milestone**: Feature flag toggled via plan; tests generated; policy enforced

- `@anvil/flags` library with OpenFeature provider
- CLI: `anvil flags add/set` → emits APS deltas
- Generated tests and documentation

### Phase 9: Productioniser (Weeks 17-18)

**Milestone**: `anvil productionise` outputs plan on toy repo

- Repo scanner for missing tests/docs/lint
- Suggests scaffolds as APS
- Safe by default heuristics

### Phase 10: GitHub Integration (Weeks 19-20)

**Milestone**: Demo PR blocked/unblocked by Gate

- GitHub Action template: run anvil gate; block PRs on fail
- Sample app consumes `@anvil/flags`

### Phase 11: Hardening & Documentation (Weeks 21-22)

**Milestone**: Docs published in /docs with examples

- Improve secrets patterns; SARIF output for scanners
- Developer docs; contribution guide; policy cookbook

### Phase 12: Release Candidate (Weeks 23-24)

**Milestone**: RC tag; sample walkthrough recorded

- Version bump; changelog; signed artifacts/checksums
- "Day-0" runbook; incident/rollback procedure

## Risk Analysis and Mitigations

### Technical Risks

**Risk**: False-positive secret scans **Mitigation**: Start with warn, graduate
to block with allowlist

**Risk**: Slow Gate on big repos **Mitigation**: Run scoped to changed files;
parallelize; cache

**Risk**: Policy brittleness **Mitigation**: Maintain fixtures; semantic version
the policy bundle

**Risk**: Plan drift **Mitigation**: Treat hash as source of truth; reject
modified plans without re-hash

### Delivery Risks

**Risk**: Scope creep beyond MVP **Mitigation**: Strict adherence to defined MVP
scope; defer non-essential features

**Risk**: Integration complexity with existing tools **Mitigation**: Start with
simple integrations; comprehensive testing on real repositories

**Risk**: Performance issues with large repositories **Mitigation**: Early
performance testing; optimization focused on changed files

## Technology Decisions

### Core Stack

- **Language**: TypeScript (Node.js ES2022 with ES modules)
- **Build System**: Nx with TypeScript plugin for automatic task inference
- **Package Manager**: pnpm workspaces
- **Validation**: Zod for runtime validation, Ajv for JSON Schema
- **CLI Framework**: Commander.js
- **Testing**: Vitest for unit/integration tests
- **Policy Engine**: OPA/Rego

### Quality Gates

- **Linting**: ESLint with strict TypeScript rules
- **Formatting**: Prettier
- **Pre-commit**: Husky for git hooks
- **Coverage**: >85% for core components, >90% for critical paths
- **Security**: Secret scanning, SAST analysis, dependency auditing

### Deployment & Release

- **CI/CD**: GitHub Actions
- **Artifacts**: npm packages with checksums
- **Versioning**: Semantic versioning with conventional commits
- **Documentation**: Generated from code + manual guides

## Out of Scope (MVP)

The following items are explicitly excluded from the MVP to maintain focus:

- Terraform/Kubernetes integrations
- Multi-model AI switchboard
- Managed hosting/SaaS offering
- Marketplace for third-party packs
- Advanced UI beyond minimal dashboard
- Language support beyond TypeScript/JavaScript
- Enterprise features (SSO, RBAC, etc.)
- Performance optimization beyond basic needs

## Stretch Goals (Post-MVP)

Items to consider after MVP completion:

- Rust/Go worker for high-performance scanning
- Minimal React dashboard for approvals/history
- SBOM + sigstore provenance on releases
- Additional Packs (observability, telemetry enrichers)
- Multi-language support
- Enterprise integrations

## References

For detailed task breakdowns and implementation specifics, see
[TODO.md](./TODO.md).
