# Anvil — Comprehensive Project Plan & TODO

## Objectives & Success Criteria

**Mission:** Ship an MVP sidecar/forge that converts human/AI intent into
deterministic plans (APS), gates them through one quality bar, and applies or
rolls back with evidence.

**We’re “done” when**

- A developer can run:

```bash
anvil plan "add feature flag"
anvil gate plan.json
anvil apply plan.json
anvil rollback plan.json
```

- Plans are hash-stable and validated by Zod; evidence is appended immutably.

- Plan Gate enforces lint, tests, coverage threshold, secrets scan, and at least
  one policy rule.

- Packs work end-to-end, starting with OpenFeature flags (swap-capable to
  FeatureBoard).

- GitHub Action blocks merges that fail the Gate.

## Scope (MVP)

- APS Core: Zod schema + canonicalisation + hashing + JSON Schema export.

- CLI: plan/validate/export/gate/apply/rollback/productionise.

- Plan Gate: ESLint, Vitest + coverage, secrets scan, SAST placeholder, OPA
  policy hook.

- Sidecar Runtime: dry-run → evidence; apply/rollback with audit.

- Packs (Flags first): @anvil/pack-flags using OpenFeature (file store + env
  overrides).

- Productioniser: scans repo; emits remediation APS.

- Integrations: GitHub Action template; optional minimal React dashboard later.

**Out-of-scope: for MVP:** Terraform/K8s, multi-model switchboard, managed
hosting, marketplace.

## Architecture (quick map)

```text
Dev/IDE/Agent → APS draft (Zod) → Sidecar dry-run → Evidence
                      ↓                    ↓
                 Plan Gate (lint/tests/coverage/secrets/policy)
                      ↓
               Approve → Apply → Audit trail → Rollback
```

- Language split: TypeScript everywhere; option to add a small systems binary
  later (Go/Rust) for heavy scanning—post-MVP.

- Policy: OPA/Rego evaluated by the Gate; rules live in a bundle versioned with
  the repo.

- Packs: Emit APS deltas (never direct file writes).

## Workstreams & Leads

1. Core Spec & Gate – APS, canonicalisation, Gate runner, OPA hook.

2. CLI & Sidecar – commands, long-running process, evidence bundle.

3. Packs – flags pack (OpenFeature), scaffolding, CLI subcommands.

4. Productioniser – repo scanner + remediation APS.

5. Integrations & DX – GitHub Action, docs, sample repo; optional dashboard.

6. Quality & Policy – tests, coverage, secrets; policy rules + fixtures.

## Phasing

### Phase 1: Foundations

- Nx monorepo + pnpm workspaces; folders: core/, cli/, packs/, ui/
  (placeholder).

- CI: lint + test workflow; status badge; Node versions pinned.

**Done:** repo boots green in CI.

### Phase 2: APS Spine

- Drop in APS Zod schema; canonicalise + hash; JSON Schema export.

- Golden tests (same input → same hash).

**Done:** pnpm core:test stable; schema version 0.1.0 locked.

### Phase 3: CLI (plan/validate/export)

- anvil plan, validate, export with proper error maps.

- Persist plans to .anvil/plans/.

**Done:** Create/validate/export plan locally.

### Phase 4: Gate v1

- Gate runner with ESLint + Vitest coverage + secrets (regex) + SAST
  placeholder.

- Gate result appended to plan evidence.

**Done:** Passing and failing repo fixtures; clear output.

### Phase 5: OPA/Rego hook

- Bundle OPA; policy rule samples:

- coverage_min >= 80 for changed files.

- “no client-side high-risk flags”.

- Add policy evaluation to Gate.

**Done:** Policy pass/fail reflected in evidence; rule tests included.

### Phase 6: Sidecar (dry-run)

- Daemon process; dry-run creates evidence bundle (diffs/logs/reports).

- Append immutable evidence[].

**Done:** anvil dry-run plan.json produces diff + logs.

### Phase 7: Apply & Rollback

- Idempotent apply with audit record; rollback to previous state.

- Guard: apply allowed only if Gate passed and plan approved.

**Done:** Draft → Gate → Approve → Apply → Rollback E2E test green.

### Phase 8: Packs — Flags (OpenFeature)

- @anvil/flags library (provider adapter); file store + env overrides.

- CLI: anvil flags add/set → emits APS deltas; generated tests/docs.

**Done:** Feature flag toggled via plan; tests generated; policy enforced.

### Phase 9: Productioniser

- Repo scanner: missing tests/docs/lint; suggests scaffolds as APS.

- Basic heuristics; safe by default.

**Done:** anvil productionise outputs a plan on a toy repo.

### Phase 10: GitHub Action & Sample Repo

- Action template: run anvil gate; block PRs on fail.

- Sample app consumes @anvil/flags.

**Done:** Demo PR blocked/unblocked by Gate.

### Phase 11: Hardening & Docs

- Improve secrets patterns; SARIF output for scanners.

- Developer docs; contribution guide; policy cookbook.

**Done:** Docs published in /docs with examples.

### Phase 12: Release Candidate

- Version bump; changelog; signed artefacts/checksums.

- “Day-0” runbook; incident/rollback procedure.

**Done:** RC tag; sample walkthrough recorded.

## Backlog → Issues

**Epic: APS Core**

- [ ]APS schema (Zod) with branding + enums; schema_version literal.

- [ ] Canonicalise + hash; stable stringify; SHA-256.

- [ ] JSON Schema export; CI artefact.

- [ ] Golden tests for hash determinism.

- [ ] Nice error mapping for CLI users.

**Epic: CLI**

- [ ] plan <intent> (with provenance stubs).

- [ ] validate, export (JSON/YAML).

- [ ] Plan storage under .anvil/plans/.

- [ ] Pretty printer for plans.

**Epic: Plan Gate**

- [ ] ESLint integration (programmatic).

- [ ] Vitest + coverage threshold for changed files.

- [ ] Secrets scan (regex + denylist/allowlist).

- [ ] SAST placeholder with structured output.

- [ ] Evidence bundling (diff/log/report).

- [ ] Exit codes & summary table.

**Epic: OPA/Rego**

- [ ] Vendor OPA binary; version pin.

- [ ] Policy bundle structure; example rules.

- [ ] Policy tests (pass/fail fixtures).

- [ ] CLI anvil gate includes policy step.

**Epic: Sidecar**

- [ ] JSON-RPC server; plan store; evidence writer.

- [ ] dry-run sandbox (no network; temp worktree).

- [ ] apply transactional writes + audit.

- [ ] rollback previous snapshot; idempotency.

- [ ] Approvals model (simple local log for MVP).

**Epic: Packs — Flags**

- [ ] @anvil/flags provider interface; OpenFeature provider.

- [ ] File store (flags.env.json) + env overrides.

- [ ] CLI flags add/set → APS deltas.

- [ ] Generated tests and docs.

- [ ] Policy: no client-side high-risk flags.

- [ ] Stub FeatureBoardProvider (unimplemented methods) + adapter tests.

**Epic: Productioniser**

- [ ] Scanner (tests/docs/lint presence; folder hygiene).

- [ ] Remediation plan generator (APS).

- [ ] Fixture repos + assertions.

**Epic: Integrations & DX**

- [ ] GitHub Action: Gate on PR.

- [ ] Sample repo demonstrating flags.

- [ ] Minimal dashboard (optional): plan list + approve.

**Epic: Quality & Security**

- [ ] Coverage > 85% on core/gate.

- [ ] SARIF outputs for scans.

- [ ] Supply-chain: npm audit, pnpm lockfile pinned, provenance note.

## Testing Strategy

- **Unit:** APS validation; canonicalisation; CLI commands; pack functions.

- **Integration:** Dry-run → evidence; Gate across real fixtures;
  apply/rollback.

- **Policy tests:** Rego rules with pass/fail bundles.

- **Golden tests:** Deterministic hashing + stable evidence layout.

- **Smoke via GitHub Action:** PR that fails on purpose (secret, low coverage).

## Policy (initial Rego rules)

- `allow.apply` requires:
  - `gate.eslint == pass`

  - `gate.tests.coverage >= 80` for changed files

  - `gate.secrets == pass`

- `flags_client_side_guard`:
  - deny if any `pack.flags.client_side == true && intent.risk == "high"`

- `unknown_flag_usage`:
  - deny apply if app references a flag key not declared in the plan or store.

## Security & Compliance

- **No direct writes from agents/IDEs. Only via plans.**

- **Dry-run sandbox:** network off; ephemeral worktree; masked env.

- **Secrets:** deny patterns + allow-listed paths; SARIF output; PR annotations.

- **Provenance:** record author/tool/model, timestamps; append-only evidence.

## Observability (MVP-level)

- **CLI and sidecar structured logs (JSON) with correlation IDs.**

- **Counters** plans created, gate passes/fails, apply/rollback counts, flag
  evaluations.

- **Optional:** export simple metrics to stdout for CI scrape.

## Environments & Release

- **Dev:** local Node; file stores; verbose logging.

- **CI:** pinned Node; OPA binary vendored; reproducible toolchain.

- **Release artefacts:** npm packages (`@anvil/aps`, `@anvil/cli`,
  `@anvil/flags`), checksums; Action template.

## Migration to FeatureBoard (post-MVP plan)

1. Keep app importing `@anvil/flags` only.

2. Implement `FeatureBoardProvider` behind the same adapter interface.

3. Snapshot current OpenFeature evaluations; replay against FeatureBoard in CI.

4. Optional dual-read during a burn-in period.

5. Flip `"provider": "featureboard"` in Pack config via APS plan; remove file
   store once stable.

## Definition of Done (per feature)

- All code has unit tests; coverage meets Gate threshold.

- Plans validate; hashes stable; policy tests pass.

- CLI UX documented; example included.

- PR passes Action; CHANGELOG updated.

## Risks & Mitigations

- **False-positive secret scans** → start with warn, graduate to block with
  allowlist.

- **Slow Gate on big repos** → run scoped to changed files; parallelise; cache.

- **Policy brittleness** → maintain fixtures; semantic version the policy
  bundle.

- **Plan drift** → treat hash as source of truth; reject modified plans without
  re-hash.

## Stretch (only after MVP is green)

- Rust/Go worker for high-perf secret/SAST scanning and maybe CLI.

- Minimal React dashboard for approvals/history.

- SBOM + sigstore provenance on releases.

- More Packs (observability, telemetry enrichers).
