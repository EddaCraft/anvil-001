# Anvil — Comprehensive Project TODO

## Project Overview

**Mission**: Ship an MVP sidecar/forge that converts human/AI intent into deterministic plans (APS), gates them through one quality bar, and applies or rolls back with evidence.

**Success Criteria**: A developer can run:
```bash
anvil plan "add feature flag"
anvil gate plan.json
anvil apply plan.json
anvil rollback plan.json
```

## Architecture Overview

```text
Dev/IDE/Agent → APS draft (Zod) → Sidecar dry-run → Evidence
                      ↓                    ↓
                 Plan Gate (lint/tests/coverage/secrets/policy)
                      ↓
               Approve → Apply → Audit trail → Rollback
```

## Phase-Based Implementation Plan

### Phase 1: Foundations 🏗️
**Timeline**: Week 1  
**Status**: Pending  
**Goal**: Repo boots green in CI

#### Tasks:
- [ ] Set up Nx monorepo with pnpm workspaces
- [ ] Create folder structure: `core/`, `cli/`, `packs/`, `ui/` (placeholder)
- [ ] Configure CI: lint + test workflow
- [ ] Add status badge
- [ ] Pin Node versions
- [ ] Ensure repo boots green in CI

### Phase 2: APS Spine 🧬
**Timeline**: Week 2  
**Status**: Pending  
**Goal**: pnpm core:test stable; schema version 0.1.0 locked

#### Tasks:
- [ ] Drop in APS Zod schema
- [ ] Implement canonicalization + hashing
- [ ] Add JSON Schema export
- [ ] Create golden tests (same input → same hash)
- [ ] Ensure deterministic hash generation

### Phase 3: CLI (plan/validate/export) 🖥️
**Timeline**: Week 3  
**Status**: Pending  
**Goal**: Create/validate/export plan locally

#### Tasks:
- [ ] Implement `anvil plan <intent>` command
- [ ] Implement `anvil validate <plan>` command
- [ ] Implement `anvil export <plan>` command
- [ ] Add proper error mapping
- [ ] Persist plans to `.anvil/plans/`
- [ ] Add pretty printer for plans

### Phase 4: Gate v1 🚪
**Timeline**: Week 4  
**Status**: Pending  
**Goal**: Passing and failing repo fixtures; clear output

#### Tasks:
- [ ] Build gate runner with pluggable checks
- [ ] Integrate ESLint (programmatic)
- [ ] Add Vitest + coverage threshold for changed files
- [ ] Implement secrets scan (regex + denylist/allowlist)
- [ ] Add SAST placeholder with structured output
- [ ] Bundle evidence (diff/log/report)
- [ ] Add exit codes & summary table

### Phase 5: OPA/Rego Hook 📋
**Timeline**: Week 5  
**Status**: Pending  
**Goal**: Policy pass/fail reflected in evidence; rule tests included

#### Tasks:
- [ ] Vendor OPA binary; version pin
- [ ] Create policy bundle structure
- [ ] Add example rules:
  - [ ] `coverage_min >= 80` for changed files
  - [ ] "no client-side high-risk flags"
- [ ] Add policy tests (pass/fail fixtures)
- [ ] Integrate policy evaluation into Gate

### Phase 6: Sidecar (dry-run) 🔄
**Timeline**: Week 6  
**Status**: Pending  
**Goal**: anvil dry-run plan.json produces diff + logs

#### Tasks:
- [ ] Create daemon process
- [ ] Implement JSON-RPC server
- [ ] Add plan store and evidence writer
- [ ] Build dry-run sandbox (no network; temp worktree)
- [ ] Append immutable evidence[]
- [ ] Create evidence bundle (diffs/logs/reports)

### Phase 7: Apply & Rollback ⚡
**Timeline**: Week 7  
**Status**: Pending  
**Goal**: Draft → Gate → Approve → Apply → Rollback E2E test green

#### Tasks:
- [ ] Implement idempotent apply with audit record
- [ ] Add rollback to previous state
- [ ] Create guard: apply allowed only if Gate passed and plan approved
- [ ] Add approvals model (simple local log for MVP)
- [ ] Implement transactional writes + audit

### Phase 8: Packs — Flags (OpenFeature) 🏁
**Timeline**: Week 8  
**Status**: Pending  
**Goal**: Feature flag toggled via plan; tests generated; policy enforced

#### Tasks:
- [ ] Create @anvil/flags library
- [ ] Implement OpenFeature provider interface
- [ ] Add file store (flags.env.json) + env overrides
- [ ] Create CLI commands: `anvil flags add/set` → emits APS deltas
- [ ] Generate tests and docs
- [ ] Add policy: no client-side high-risk flags
- [ ] Stub FeatureBoardProvider (unimplemented methods) + adapter tests

### Phase 9: Productioniser 🔧
**Timeline**: Week 9  
**Status**: Pending  
**Goal**: anvil productionise outputs a plan on a toy repo

#### Tasks:
- [ ] Build repo scanner (tests/docs/lint presence; folder hygiene)
- [ ] Create remediation plan generator (APS)
- [ ] Add fixture repos + assertions
- [ ] Implement basic heuristics; safe by default

### Phase 10: GitHub Action & Sample Repo 🐙
**Timeline**: Week 10  
**Status**: Pending  
**Goal**: Demo PR blocked/unblocked by Gate

#### Tasks:
- [ ] Create GitHub Action template: run anvil gate; block PRs on fail
- [ ] Build sample app consuming @anvil/flags
- [ ] Add minimal dashboard (optional): plan list + approve

### Phase 11: Hardening & Docs 📚
**Timeline**: Week 11  
**Status**: Pending  
**Goal**: Docs published in /docs with examples

#### Tasks:
- [ ] Improve secrets patterns
- [ ] Add SARIF output for scanners
- [ ] Create developer docs
- [ ] Add contribution guide
- [ ] Build policy cookbook

### Phase 12: Release Candidate 🚀
**Timeline**: Week 12  
**Status**: Pending  
**Goal**: RC tag; sample walkthrough recorded

#### Tasks:
- [ ] Version bump
- [ ] Create changelog
- [ ] Generate signed artifacts/checksums
- [ ] Create "Day-0" runbook
- [ ] Document incident/rollback procedure

## Specification Tools Integration (Per RFC)

### Plugin Architecture 🔌
**Status**: Pending

#### Tasks:
- [ ] Implement plugin architecture for specification tools
- [ ] Create BMAD-METHOD integration adapter
- [ ] Add GitHub Spec-kit integration adapter
- [ ] Maintain native APS as fallback option
- [ ] Add user preference configuration
- [ ] Create migration tools between specification formats

#### Technical Implementation:
- [ ] Define `SpecToolAdapter` interface
- [ ] Implement `BMADMethodAdapter` class
- [ ] Implement `GitHubSpecKitAdapter` class
- [ ] Add CLI commands:
  - [ ] `anvil spec generate --tool bmad "intent"`
  - [ ] `anvil spec generate --tool github-spec-kit "intent"`
  - [ ] `anvil spec convert --from bmad --to aps plan.json`
  - [ ] `anvil spec validate --tool bmad plan.json`

## Core Components Implementation

### APS Core Schema 📋
**Status**: Pending

#### Tasks:
- [ ] Define JSON Schema 2020-12 format
- [ ] Implement deterministic hash generation
- [ ] Add core fields:
  - [ ] `id`: Pattern `^aps-[a-f0-9]{8}$`
  - [ ] `hash`: SHA-256 pattern `^[a-f0-9]{64}$`
  - [ ] `intent`: String with min/max length
  - [ ] `proposed_changes`: Array of change objects
  - [ ] `provenance`: Creation metadata
  - [ ] `validations`: Check requirements
- [ ] Add required fields configuration
- [ ] Implement field constraints and formats

### Hash Generation & Validation 🔐
**Status**: Pending

#### Tasks:
- [ ] Implement SHA-256 hashing
- [ ] Add canonicalization for stable serialization
- [ ] Create hash verification
- [ ] Add unique ID generation
- [ ] Implement golden tests for determinism

### CLI Commands 🖥️
**Status**: Pending

#### Tasks:
- [ ] `anvil plan <intent>` - Create new APS plan
- [ ] `anvil validate <plan>` - Validate plan against schema
- [ ] `anvil export <plan>` - Export to JSON/YAML
- [ ] `anvil gate <plan>` - Run quality checks
- [ ] `anvil apply <plan>` - Execute plan
- [ ] `anvil rollback <plan>` - Revert changes
- [ ] `anvil productionise` - Scan repo and generate remediation

### Plan Gate Implementation 🚪
**Status**: Pending

#### Tasks:
- [ ] ESLint integration (programmatic)
- [ ] Vitest + coverage threshold for changed files
- [ ] Secrets scan (regex + denylist/allowlist)
- [ ] SAST placeholder with structured output
- [ ] Evidence bundling (diff/log/report)
- [ ] Exit codes & summary table
- [ ] OPA/Rego policy evaluation

### Sidecar Runtime 🔄
**Status**: Pending

#### Tasks:
- [ ] JSON-RPC server
- [ ] Plan store and evidence writer
- [ ] Dry-run sandbox (no network; temp worktree)
- [ ] Apply transactional writes + audit
- [ ] Rollback previous snapshot; idempotency
- [ ] Approvals model (simple local log for MVP)

### Flags Pack Implementation 🏁
**Status**: Pending

#### Tasks:
- [ ] @anvil/flags provider interface
- [ ] OpenFeature provider implementation
- [ ] File store (flags.env.json) + env overrides
- [ ] CLI flags add/set → APS deltas
- [ ] Generated tests and docs
- [ ] Policy: no client-side high-risk flags
- [ ] FeatureBoardProvider stub + adapter tests

### Productioniser Scanner 🔧
**Status**: Pending

#### Tasks:
- [ ] Scanner (tests/docs/lint presence; folder hygiene)
- [ ] Remediation plan generator (APS)
- [ ] Fixture repos + assertions
- [ ] Basic heuristics; safe by default

### GitHub Integration 🐙
**Status**: Pending

#### Tasks:
- [ ] GitHub Action: Gate on PR
- [ ] Sample repo demonstrating flags
- [ ] Minimal dashboard (optional): plan list + approve

## Quality & Security Requirements

### Testing Strategy 🧪
**Status**: Pending

#### Tasks:
- [ ] Unit tests: APS validation; canonicalization; CLI commands; pack functions
- [ ] Integration tests: Dry-run → evidence; Gate across real fixtures; apply/rollback
- [ ] Policy tests: Rego rules with pass/fail bundles
- [ ] Golden tests: Deterministic hashing + stable evidence layout
- [ ] Smoke via GitHub Action: PR that fails on purpose (secret, low coverage)

### Security & Compliance 🔒
**Status**: Pending

#### Tasks:
- [ ] No direct writes from agents/IDEs. Only via plans
- [ ] Dry-run sandbox: network off; ephemeral worktree; masked env
- [ ] Secrets: deny patterns + allow-listed paths; SARIF output; PR annotations
- [ ] Provenance: record author/tool/model, timestamps; append-only evidence

### Observability 📊
**Status**: Pending

#### Tasks:
- [ ] CLI and sidecar structured logs (JSON) with correlation IDs
- [ ] Counters: plans created, gate passes/fails, apply/rollback counts, flag evaluations
- [ ] Optional: export simple metrics to stdout for CI scrape

## Policy Rules (Initial Rego)

### Core Policies 📋
**Status**: Pending

#### Tasks:
- [ ] `allow.apply` requires:
  - [ ] `gate.eslint == pass`
  - [ ] `gate.tests.coverage >= 80` for changed files
  - [ ] `gate.secrets == pass`
- [ ] `flags_client_side_guard`:
  - [ ] deny if any `pack.flags.client_side == true && intent.risk == "high"`
- [ ] `unknown_flag_usage`:
  - [ ] deny apply if app references a flag key not declared in the plan or store

## Success Metrics

### Technical Metrics 📈
- [ ] Plugin architecture successfully implemented
- [ ] Both tools integrated with <5% performance impact
- [ ] 100% backward compatibility with existing APS
- [ ] All existing tests pass with new integrations

### User Experience Metrics 👥
- [ ] User satisfaction with specification quality (target: >4.5/5)
- [ ] Adoption rate of AI-driven specifications (target: >60% of users)
- [ ] Time to generate specifications (target: <30% reduction)

## Definition of Done (Per Feature)

### Completion Criteria ✅
- [ ] All code has unit tests; coverage meets Gate threshold
- [ ] Plans validate; hashes stable; policy tests pass
- [ ] CLI UX documented; example included
- [ ] PR passes Action; CHANGELOG updated

## Risks & Mitigations

### Identified Risks ⚠️
- [ ] **False-positive secret scans** → start with warn, graduate to block with allowlist
- [ ] **Slow Gate on big repos** → run scoped to changed files; parallelise; cache
- [ ] **Policy brittleness** → maintain fixtures; semantic version the policy bundle
- [ ] **Plan drift** → treat hash as source of truth; reject modified plans without re-hash

## Stretch Goals (Post-MVP)

### Future Enhancements 🚀
- [ ] Rust/Go worker for high-perf secret/SAST scanning and maybe CLI
- [ ] Minimal React dashboard for approvals/history
- [ ] SBOM + sigstore provenance on releases
- [ ] More Packs (observability, telemetry enrichers)

## Migration to FeatureBoard (Post-MVP)

### Migration Plan 🔄
- [ ] Keep app importing `@anvil/flags` only
- [ ] Implement `FeatureBoardProvider` behind the same adapter interface
- [ ] Snapshot current OpenFeature evaluations; replay against FeatureBoard in CI
- [ ] Optional dual-read during a burn-in period
- [ ] Flip `"provider": "featureboard"` in Pack config via APS plan; remove file store once stable

---

## Daily Standup Template

### What was completed yesterday?
- 

### What will be done today?
- 

### Any blockers?
- 

### Testing status
- Unit tests: 0/50
- Integration tests: 0/15
- Coverage: 0%

---

**Last Updated**: 2024-01-15  
**Next Review**: Daily  
**Project Lead**: Development Team