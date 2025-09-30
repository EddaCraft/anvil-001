# Anvil Implementation TODO

This document provides a comprehensive task list for implementing Anvil,
following the three-act strategic vision whilst maintaining practical MVP focus.
Tasks are organised by phase and epic with detailed acceptance criteria. For
strategic context, see [PLAN.md](./PLAN.md).

## Executive Summary

**Current Status**: Phase 2 (APS Core) 80% complete, Phase 4 (Gate) 90% complete
**Next Critical Path**: Adapters → CLI Integration → Dry-run → Apply/Rollback
**Target MVP**: 14-16 weeks from current state

### Strategic Priorities (in order)

1. **Interoperability First** - SpecKit & BMAD adapters (Act 1 wedge)
2. **Developer Experience** - CLI commands that work with existing formats
3. **Validation & Safety** - Gate integration with formats
4. **Production Readiness** - Apply/rollback with audit trail

## Progress Summary

### ✅ Completed Phases (16% overall)

- **Phase 1: Foundations** - Repository structure, CI/CD, quality gates (100%)
- **Phase 2: APS Spine** - Core schema, validation, hash generation (80%)
- **Phase 4: Gate v1** - ESLint, coverage, secret scanning (90%)

### 🚧 Current Sprint (Weeks 1-2)

**Goal**: Complete APS core and begin adapter development

- [ ] Finish APS core integration (remaining 20%)
- [ ] Begin SpecKit adapter implementation
- [ ] Update CLI foundation for format detection

### 🎯 Next 4 Sprints (Weeks 3-8)

**Goal**: Working interoperability with SpecKit and BMAD

- Weeks 3-4: SpecKit adapter + tests
- Weeks 5-6: BMAD adapter + tests
- Weeks 7-8: Gate integration with both formats

### 📋 Remaining Work (Phases 5-12)

- Phase 5: Policy engine (OPA/Rego)
- Phase 6: Sidecar & dry-run
- Phase 7: Apply & rollback
- Phase 8: GitHub integration
- Phases 9-12: Productioniser, hardening, release

---

## Phase 1: Foundations ✅ COMPLETE

### Epic: Infrastructure Setup

#### Repository Structure ✅

- [x] Initialize Nx monorepo structure
- [x] Configure `pnpm-workspace.yaml`
- [x] Ensure folder structure: `core/`, `cli/`, `gate/`, `adapters/`
- **Date Completed**: 2025-09-22
- **Date Committed**: 2025-09-22

#### CI/CD Pipeline ✅

- [x] GitHub Actions workflow for lint + test
- [x] Status badges in README
- [x] Node.js version pinning (>=18.0.0)
- [x] Cache pnpm dependencies
- **Date Completed**: 2025-09-22
- **Date Committed**: 2025-09-22

#### Quality Gates ✅

- [x] ESLint configuration with TypeScript rules
- [x] Prettier formatting rules
- [x] Husky pre-commit hooks
- [x] TypeScript strict mode configuration
- **Date Completed**: 2025-09-22
- **Date Committed**: 2025-09-22

---

## Phase 2: APS Spine (80% Complete)

### Epic: APS Core Implementation

#### Schema Definition ✅

- [x] Create schema directory structure
- [x] Define APS Zod Schema with all required fields
- [x] Export JSON Schema for compatibility
- [x] TypeScript type generation
- **Date Completed**: 2025-09-26
- **Status**: Core schema complete, pending final integration

#### Hash Generation ✅

- [x] Implement canonicalisation utilities
- [x] SHA-256 hash generation
- [x] Hash verification functions
- [x] Plan ID generation (aps-[8 hex])
- **Date Completed**: 2025-09-26
- **Status**: Complete and tested

#### Validation Implementation ✅

- [x] Create validation module structure
- [x] APS Validator class with Zod
- [x] Error formatting for CLI
- [x] Comprehensive test coverage
- **Date Completed**: 2025-09-26
- **Status**: Complete and tested

#### Integration & Deployment (20% Remaining)

- [ ] **Integrate APS with CLI infrastructure**
  - [ ] Export all APS utilities from core package
  - [ ] Update CLI package.json to use core package
  - [ ] Add integration tests for CLI + APS
  - **Acceptance**: CLI can import and use APS validation
  - **Blocker**: Required for adapter development
  - **Target**: Week 1

- [ ] **Documentation for APS Core**
  - [ ] API documentation for all exported functions
  - [ ] Usage examples for developers
  - [ ] Migration guide from manual JSON
  - **Acceptance**: Developers can use APS without source code inspection
  - **Target**: Week 2

---

## Phase 2.5: Adapters (NEW - CRITICAL PATH)

### Epic: Format Interoperability

**Strategic Rationale**: Users won't adopt a new format. We must work with
existing planning formats (SpecKit, BMAD) whilst using APS internally for
validation and execution.

#### Adapter Architecture

- [ ] **Create adapter framework** (`adapters/src/base/`)
  - [ ] Define `FormatAdapter` interface:
    ```typescript
    interface FormatAdapter {
      name: string;
      supportedExtensions: string[];
      detect(content: string): boolean;
      parse(content: string): APSPlan;
      serialize(plan: APSPlan): string;
      validate(content: string): ValidationResult;
    }
    ```
  - [ ] Implement adapter registry for format detection
  - [ ] Add adapter testing utilities
  - [ ] Create adapter documentation template
  - **Acceptance**: Framework supports pluggable adapters
  - **Dependencies**: APS core complete
  - **Target**: Week 2
  - **Sprint**: Current

#### SpecKit Adapter (Customer #1)

- [ ] **Implement SpecKit parser** (`adapters/src/speckit/`)
  - [ ] Parse `spec.md` / `plan.md` format
  - [ ] Extract intent from spec structure
  - [ ] Map SpecKit sections to APS proposed_changes
  - [ ] Handle SpecKit metadata (authors, versions)
  - [ ] Preserve round-trip fidelity
  - **Acceptance**: Valid SpecKit documents convert to valid APS
  - **Target**: Week 3

- [ ] **Implement SpecKit serialiser**
  - [ ] Convert APS back to SpecKit format
  - [ ] Preserve original formatting where possible
  - [ ] Update SpecKit with validation results
  - [ ] Inject evidence as SpecKit comments/annotations
  - **Acceptance**: Round-trip conversion preserves intent
  - **Target**: Week 3

- [ ] **SpecKit adapter tests**
  - [ ] Fixture: Valid SpecKit documents (5+ examples)
  - [ ] Fixture: Invalid SpecKit documents
  - [ ] Round-trip tests (parse → serialise → parse)
  - [ ] Integration with gate validation
  - **Acceptance**: >95% test coverage, all fixtures pass
  - **Target**: Week 4

- [ ] **CLI integration for SpecKit**
  - [ ] Auto-detect SpecKit format in CLI
  - [ ] `anvil gate spec.md` works end-to-end
  - [ ] `anvil validate plan.md` provides feedback
  - [ ] Evidence updates append to SpecKit files
  - **Acceptance**: SpecKit users can validate plans
  - **Demo**: Show Customer #1
  - **Target**: Week 4

#### BMAD Adapter (Customer #2)

- [ ] **Implement BMAD parser** (`adapters/src/bmad/`)
  - [ ] Parse PRD/architecture doc formats
  - [ ] Extract requirements and acceptance criteria
  - [ ] Map BMAD structure to APS proposed_changes
  - [ ] Handle BMAD metadata and versioning
  - [ ] Support multiple BMAD document types
  - **Acceptance**: Valid BMAD documents convert to valid APS
  - **Target**: Week 5

- [ ] **Implement BMAD serialiser**
  - [ ] Convert APS back to BMAD format
  - [ ] Preserve document structure
  - [ ] Update BMAD with validation results
  - [ ] Inject evidence as BMAD annotations
  - **Acceptance**: Round-trip conversion works correctly
  - **Target**: Week 5

- [ ] **BMAD adapter tests**
  - [ ] Fixture: Valid BMAD documents (5+ examples)
  - [ ] Fixture: Invalid BMAD documents
  - [ ] Round-trip tests
  - [ ] Integration with gate validation
  - **Acceptance**: >95% test coverage, all fixtures pass
  - **Target**: Week 6

- [ ] **CLI integration for BMAD**
  - [ ] Auto-detect BMAD format in CLI
  - [ ] `anvil gate prd.md` works end-to-end
  - [ ] Evidence updates work correctly
  - **Acceptance**: BMAD users can validate plans
  - **Demo**: Show Customer #2
  - **Target**: Week 6

#### Format Detection

- [ ] **Implement format auto-detection**
  - [ ] Content-based detection (not just file extension)
  - [ ] Confidence scoring for format detection
  - [ ] Fallback to APS native format
  - [ ] Clear error messages for unknown formats
  - **Acceptance**: `anvil gate <any-format>` just works
  - **Target**: Week 6

---

## Phase 3: CLI Foundation (30% Complete)

### Epic: CLI Interface

**Status**: Commander.js setup complete, commands need implementation with
adapter support

#### Core Commands

- [ ] **Implement `anvil plan <intent>`**
  - [ ] Accept format flag: `--format=speckit|bmad|aps`
  - [ ] Generate plan in specified format
  - [ ] Save to `.anvil/plans/` directory
  - [ ] Display plan summary
  - [ ] Support interactive mode for missing details
  - **Acceptance**: Users can create plans in their preferred format
  - **Dependencies**: Adapter framework
  - **Target**: Week 7

- [ ] **Implement `anvil validate <plan>`**
  - [ ] Auto-detect plan format
  - [ ] Convert to APS for validation
  - [ ] Run schema + hash validation
  - [ ] Display validation results
  - [ ] Support `--format` for output
  - **Acceptance**: Validates any supported format
  - **Dependencies**: Adapter framework, APS validator
  - **Target**: Week 7

- [ ] **Implement `anvil gate <plan>`**
  - [ ] Auto-detect plan format
  - [ ] Convert to APS if needed
  - [ ] Run all configured checks (lint, test, coverage, secrets)
  - [ ] Collect evidence
  - [ ] Update source file with results
  - [ ] Display summary table
  - [ ] Exit with appropriate code
  - **Acceptance**: Gate works with all supported formats
  - **Dependencies**: Gate v1, Adapter framework
  - **Target**: Week 8

- [ ] **Implement `anvil export <plan>`**
  - [ ] Export to different formats: `--to=speckit|bmad|aps|json|yaml`
  - [ ] Preserve all data during conversion
  - [ ] Validate exported format
  - **Acceptance**: Plans can be converted between formats
  - **Target**: Week 8

#### CLI User Experience

- [ ] **Pretty printing**
  - [ ] Colourised output for validation results
  - [ ] Table formatting for gate summaries
  - [ ] Progress indicators for long operations
  - [ ] Clear error messages with suggestions
  - **Acceptance**: CLI output is professional and helpful
  - **Target**: Week 8

- [ ] **Interactive prompts**
  - [ ] Prompt for missing plan details
  - [ ] Confirmation for destructive operations
  - [ ] Format selection when ambiguous
  - **Acceptance**: CLI guides users through workflows
  - **Target**: Week 9

---

## Phase 4: Gate v1 (90% Complete)

### Epic: Quality Checks

**Status**: Check implementations complete, CLI integration pending

#### Integration Tasks (10% Remaining)

- [ ] **Connect Gate to CLI commands**
  - [ ] Wire up `anvil gate` command to gate runner
  - [ ] Support gate configuration file
  - [ ] Add check selection flags: `--checks=lint,test`
  - [ ] Support check exclusion: `--skip=coverage`
  - **Acceptance**: Gate runs via CLI with all checks
  - **Dependencies**: CLI commands
  - **Target**: Week 8

- [ ] **Evidence bundle integration**
  - [ ] Append evidence to APS plans
  - [ ] Update SpecKit/BMAD with evidence annotations
  - [ ] Store evidence separately for audit
  - [ ] Format evidence for different outputs
  - **Acceptance**: Evidence properly attached to plans
  - **Target**: Week 8

- [ ] **Gate configuration**
  - [ ] Support `.anvilrc` configuration file
  - [ ] Check-specific configuration (coverage thresholds, etc.)
  - [ ] Per-project policy overrides
  - [ ] Configuration validation
  - **Acceptance**: Users can configure gate behaviour
  - **Target**: Week 9

---

## Phase 5: OPA/Rego Integration

### Epic: Policy Engine

#### OPA Foundation

- [ ] **Vendor OPA binary**
  - [ ] Download OPA for Linux, macOS, Windows
  - [ ] Version pinning (latest stable)
  - [ ] Checksum verification
  - [ ] Binary execution wrapper
  - **Acceptance**: OPA available on all platforms
  - **Target**: Week 10

- [ ] **Policy bundle structure**
  - [ ] Define policy directory structure: `.anvil/policies/`
  - [ ] Create example policies:
    - `coverage_min.rego` - Enforce minimum coverage
    - `client_side_flags.rego` - Flag risk policies
    - `change_scope.rego` - Limit change scope
  - [ ] Policy versioning strategy
  - [ ] Policy testing framework
  - **Acceptance**: Policies can be defined and versioned
  - **Target**: Week 10

#### Policy Integration

- [ ] **Policy evaluation in Gate**
  - [ ] Call OPA with plan data
  - [ ] Collect policy violations
  - [ ] Format policy results as evidence
  - [ ] Support policy warnings vs. failures
  - **Acceptance**: Policies enforced during gate execution
  - **Dependencies**: OPA binary, Gate v1
  - **Target**: Week 11

- [ ] **Policy CLI commands**
  - [ ] `anvil policy validate` - Check policy syntax
  - [ ] `anvil policy test` - Run policy tests
  - [ ] `anvil policy list` - Show active policies
  - **Acceptance**: Users can manage policies via CLI
  - **Target**: Week 11

---

## Phase 6: Sidecar Development

### Epic: Execution Runtime

**Strategic Note**: The sidecar is where plans become changes. This is the trust
boundary.

#### Dry-run System

- [ ] **Implement dry-run** (`sidecar/src/dry-run/`)
  - [ ] Parse proposed_changes from APS
  - [ ] Generate file diffs without applying
  - [ ] Collect logs and evidence
  - [ ] Create preview bundle
  - [ ] Support rollback preview
  - **Acceptance**: `anvil dry-run plan.json` shows what would happen
  - **Target**: Week 12
  - **Demo**: This is the "wow moment"

- [ ] **Dry-run CLI command**
  - [ ] `anvil dry-run <plan>` command
  - [ ] Display diffs with syntax highlighting
  - [ ] Show impact summary (files changed, LOC, etc.)
  - [ ] Support `--output` for saving preview
  - **Acceptance**: Users can preview changes safely
  - **Dependencies**: Dry-run system
  - **Target**: Week 12

#### Sidecar Daemon

- [ ] **Daemon process** (`sidecar/src/daemon/`)
  - [ ] Background process management
  - [ ] Job queue for apply operations
  - [ ] Status monitoring
  - [ ] Graceful shutdown
  - **Acceptance**: Sidecar runs as background service
  - **Target**: Week 13

- [ ] **Evidence collection**
  - [ ] Immutable evidence appending
  - [ ] Structured evidence format
  - [ ] Evidence verification
  - [ ] Audit trail generation
  - **Acceptance**: All operations produce evidence
  - **Target**: Week 13

---

## Phase 7: Apply & Rollback

### Epic: Transactional Execution

**Critical**: This is where Anvil's core value proposition is delivered - safe,
auditable, reversible changes.

#### Apply System

- [ ] **Implement idempotent apply** (`sidecar/src/apply/`)
  - [ ] Parse proposed_changes from APS
  - [ ] Apply changes transactionally
  - [ ] Create snapshots before applying
  - [ ] Record all applied changes
  - [ ] Generate apply evidence
  - [ ] Support partial application with clear errors
  - **Acceptance**: Changes apply successfully with audit trail
  - **Target**: Week 14

- [ ] **Apply CLI command**
  - [ ] `anvil apply <plan>` command
  - [ ] Require gate pass before applying
  - [ ] Require approval flag: `--approved`
  - [ ] Display apply progress
  - [ ] Show summary of applied changes
  - **Acceptance**: Users can apply validated plans safely
  - **Dependencies**: Apply system, Gate integration
  - **Target**: Week 14

#### Rollback System

- [ ] **Implement rollback** (`sidecar/src/rollback/`)
  - [ ] Load snapshot from apply
  - [ ] Reverse applied changes
  - [ ] Verify rollback integrity
  - [ ] Generate rollback evidence
  - [ ] Support partial rollback
  - **Acceptance**: Changes can be rolled back to previous state
  - **Target**: Week 15

- [ ] **Rollback CLI command**
  - [ ] `anvil rollback <plan-id>` command
  - [ ] Display what will be rolled back
  - [ ] Require confirmation
  - [ ] Show rollback progress
  - [ ] Verify system state after rollback
  - **Acceptance**: Users can safely undo applied changes
  - **Dependencies**: Rollback system
  - **Target**: Week 15

#### Safety Guards

- [ ] **Apply guards**
  - [ ] Verify gate passed before apply
  - [ ] Check approval status
  - [ ] Validate plan hasn't been modified
  - [ ] Prevent concurrent applies
  - [ ] Timeout protection
  - **Acceptance**: Apply operations are safe by default
  - **Target**: Week 15

---

## Phase 8: GitHub Integration

### Epic: CI/CD Integration

**Goal**: Make Anvil a natural part of the development workflow

#### GitHub Action

- [ ] **Create GitHub Action** (`.github/actions/anvil-gate/`)
  - [ ] Action definition (action.yml)
  - [ ] Install Anvil CLI
  - [ ] Run gate on changed files
  - [ ] Post results as PR comment
  - [ ] Set status check (pass/fail)
  - [ ] Support configuration via workflow inputs
  - **Acceptance**: Action can be used in any repository
  - **Target**: Week 16

- [ ] **PR Integration**
  - [ ] Detect SpecKit/BMAD files in PR
  - [ ] Run gate automatically
  - [ ] Block merge on gate failure
  - [ ] Clear merge on gate pass
  - [ ] Support override via comment: `/anvil override`
  - **Acceptance**: PRs are automatically validated
  - **Target**: Week 16

- [ ] **Status checks**
  - [ ] Report individual check results
  - [ ] Provide links to detailed evidence
  - [ ] Show validation summary
  - [ ] Support required vs. optional checks
  - **Acceptance**: PR status clearly shows validation state
  - **Target**: Week 17

#### Documentation & Examples

- [ ] **GitHub Action documentation**
  - [ ] Setup guide for repositories
  - [ ] Configuration examples
  - [ ] Troubleshooting guide
  - [ ] Best practices
  - **Acceptance**: Teams can integrate Anvil easily
  - **Target**: Week 17

---

## Phase 9: Feature Flags Pack (DEFERRED)

**Note**: This is deferred post-MVP. Including spec for completeness.

### Epic: Feature Flag Management

- [ ] Feature flag library implementation
- [ ] CLI commands for flag management
- [ ] OpenFeature provider
- [ ] FeatureBoard adapter preparation
- [ ] Test generation
- [ ] Documentation

**Target**: Post-MVP (Weeks 20+)

---

## Phase 10: Productioniser (MINIMAL MVP VERSION)

### Epic: Repository Governance

**MVP Scope**: Basic scanning with safe recommendations only. Full heuristics
engine deferred.

#### Minimal Scanner

- [ ] **Basic repository scanner** (`productioniser/src/scanner/`)
  - [ ] Test coverage check
  - [ ] Documentation presence check
  - [ ] Lint configuration check
  - [ ] Basic security scan (secrets, known vulns)
  - [ ] Simple scoring system
  - **Acceptance**: Scanner identifies obvious gaps
  - **Target**: Week 18

- [ ] **Safe recommendations**
  - [ ] Suggest adding tests where missing
  - [ ] Suggest adding README if absent
  - [ ] Suggest lint setup if missing
  - [ ] Flag potential security issues
  - [ ] No automatic fixes, only suggestions
  - **Acceptance**: Recommendations are safe and valuable
  - **Target**: Week 18

#### Productioniser Command

- [ ] **Implement `anvil productionise`**
  - [ ] Scan repository
  - [ ] Generate report
  - [ ] Optionally create remediation plan
  - [ ] Support `--fix` flag for safe auto-fixes only
  - **Acceptance**: Command outputs useful assessment
  - **Target**: Week 19

---

## Phase 11: Hardening & Documentation

### Epic: Production Readiness

#### Performance Optimisation

- [ ] **Gate performance**
  - [ ] Parallel check execution
  - [ ] Caching for repeated checks
  - [ ] Incremental validation
  - [ ] Memory optimisation
  - **Acceptance**: Gate runs efficiently on large repositories
  - **Target**: Week 20

- [ ] **CLI responsiveness**
  - [ ] Fast startup time
  - [ ] Streaming output for long operations
  - [ ] Interrupt handling
  - **Acceptance**: CLI feels fast and responsive
  - **Target**: Week 20

#### Security Hardening

- [ ] **Input validation**
  - [ ] Sanitise all user inputs
  - [ ] Validate file paths
  - [ ] Prevent path traversal
  - [ ] Rate limiting for operations
  - **Acceptance**: CLI is secure against common attacks
  - **Target**: Week 21

- [ ] **Secrets handling**
  - [ ] Never log sensitive data
  - [ ] Secure evidence storage
  - [ ] Audit trail encryption (optional)
  - **Acceptance**: No secrets leaked in logs or evidence
  - **Target**: Week 21

#### Documentation

- [ ] **Developer documentation** (`docs/`)
  - [ ] Getting started guide
  - [ ] Architecture overview
  - [ ] Adapter development guide
  - [ ] API reference
  - [ ] Troubleshooting guide
  - **Acceptance**: Developers can contribute effectively
  - **Target**: Week 22

- [ ] **User documentation**
  - [ ] Installation guide
  - [ ] CLI reference
  - [ ] Configuration guide
  - [ ] Best practices
  - [ ] Examples and tutorials
  - **Acceptance**: Users can use Anvil without support
  - **Target**: Week 22

- [ ] **Policy cookbook**
  - [ ] Common policy examples
  - [ ] Policy writing guide
  - [ ] Policy testing guide
  - **Acceptance**: Users can write effective policies
  - **Target**: Week 22

---

## Phase 12: Release Candidate

### Epic: Release Preparation

#### Release Engineering

- [ ] **Version management**
  - [ ] Semantic versioning setup
  - [ ] Changelog generation
  - [ ] Version bumping automation
  - [ ] Git tagging strategy
  - **Acceptance**: Versions managed consistently
  - **Target**: Week 23

- [ ] **Artifact signing**
  - [ ] Package signing setup
  - [ ] Checksum generation
  - [ ] Provenance documentation
  - [ ] SBOM generation
  - **Acceptance**: Artifacts are signed and verifiable
  - **Target**: Week 23

#### Release Testing

- [ ] **End-to-end validation**
  - [ ] Complete workflow testing
  - [ ] Performance benchmarking
  - [ ] Security validation
  - [ ] Cross-platform testing (Linux, macOS, Windows)
  - **Acceptance**: Release candidate is production-ready
  - **Target**: Week 24

- [ ] **Sample walkthrough**
  - [ ] Video demonstration
  - [ ] Written tutorial
  - [ ] Example repository
  - **Acceptance**: New users have clear onboarding
  - **Target**: Week 24

#### Release Documentation

- [ ] **Day-0 runbook**
  - [ ] Initial deployment guide
  - [ ] Configuration recommendations
  - [ ] Common issues and solutions
  - **Acceptance**: Teams can deploy Anvil quickly
  - **Target**: Week 24

- [ ] **Release notes**
  - [ ] Feature summary
  - [ ] Breaking changes
  - [ ] Migration guide
  - [ ] Known issues
  - **Acceptance**: Release notes are clear and complete
  - **Target**: Week 24

---

## Post-MVP: Future Phases

### Deferred Features (Post-Week 24)

**These are explicitly out of scope for MVP but documented for future
planning:**

#### Advanced Features

- [ ] Rust/Go worker for performance
- [ ] React dashboard for plan approval
- [ ] Additional packs (telemetry, observability, infrastructure)
- [ ] Full productioniser with heuristics engine
- [ ] Memory layer (RAG + provenance store)
- [ ] MCP façade for agentic interoperability

#### Enterprise Features

- [ ] Multi-language support (Python, Java, Go)
- [ ] SSO authentication
- [ ] RBAC authorisation
- [ ] Advanced audit logging
- [ ] Compliance reporting
- [ ] Packs marketplace

#### Act 2 & Act 3 Expansion

- [ ] Document validation adapters (Word, Confluence, Notion)
- [ ] Analysis validation adapters (Excel, Jupyter, Tableau)
- [ ] Horizontal platform expansion (consultants, analysts, legal)

---

## Success Metrics

### MVP Success Criteria

We've achieved MVP when:

1. ✅ **Interoperability**: SpecKit and BMAD users can validate plans without
   changing formats
2. ✅ **Validation**: Gate enforces quality standards (lint, test, coverage,
   secrets, policies)
3. ✅ **Safety**: Apply and rollback work reliably with full audit trails
4. ✅ **Integration**: GitHub Action blocks PRs that fail validation
5. ✅ **Adoption**: 15-20 teams using Anvil in production

### Quality Gates for Each Phase

Each phase must meet:

- [ ] > 90% test coverage for new code
- [ ] All integration tests passing
- [ ] Documentation complete and reviewed
- [ ] Security review completed
- [ ] Performance benchmarks met

---

## Sprint Planning Template

### Current Sprint: [Week Number]

**Goal**: [Primary objective]

**Tasks**:

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Blockers**:

- None / [Description]

**Demo**:

- [What to demonstrate]

### Daily Standup

**Yesterday**: [Completed tasks] **Today**: [Planned tasks] **Blockers**:
[Issues preventing progress]

---

## Notes

### MVP Philosophy

**Ship Fast, Ship Value:**

- Focus on interoperability (adapters) before fancy features
- Validation and safety before AI assistance
- Working software before perfect software

**Defer Strategically:**

- Advanced features (packs, memory, MCP) come after validation works
- Enterprise features come after product-market fit
- Act 2/3 expansion comes after Act 1 success

### Key Architectural Decisions

1. **APS is internal** - Users never see it unless they want to
2. **Adapters are the wedge** - Work with existing formats
3. **Gate is the trust boundary** - All validation happens here
4. **Evidence is immutable** - Full audit trail always
5. **Safety first** - Rollback capability is non-negotiable

---

## Version History

- **2025-09-30**: Major revision for interoperability strategy, updated
  progress, aligned with three-act vision
- **2025-09-26**: Initial comprehensive TODO with phase breakdown
- **2025-09-22**: Repository foundations established
