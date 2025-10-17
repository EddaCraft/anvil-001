# Claude Projects Lite - Usage Instructions

## Overview

Claude Projects Lite is a lightweight starter kit for running projects natively
inside Claude Code. No servers, no orchestration frameworks, just markdown agent
files, a single commands.yaml, and a set of doc templates.

## Quick Start

1. Open Claude Code in your repo
2. Run `/agents` to see the available agents
3. Run a slash command from commands.yaml, for example:
   ```bash
   /feature "artist merch carousel"
   ```
   Claude will sequence: planner → architect → coder → reviewer → tester
4. Outputs appear step by step — you can stop, edit, or continue at any handoff

## Available Agents

- **planner** — Breaks a goal into steps, success criteria, and delegations
- **architect** — Defines interfaces, file changes, schema tweaks, and
  guardrails
- **product-manager** — Writes a crisp PRD with users, use cases, and acceptance
  criteria
- **coder** — Implements the smallest change needed, with diffs
- **tester** — Produces test plans and code from acceptance criteria
- **reviewer** — Performs pragmatic code review and decision (approve / request
  changes)
- **docs-writer** — Updates READMEs, ADRs, and usage notes
- **security-auditor** — Checks for auth, PII, dependency risk, and must-fix
  issues
- **data-modeler** (optional) — Schema/migration design
- **ui-ux-designer** (optional) — Flows, props, accessibility, and component
  breakdowns

## Slash Commands

Defined in `commands.yaml`:

- **/new-project** → Scaffold a repo with PRD, architecture, code stubs, docs,
  and tests
- **/feature** → Break down and implement a new feature end-to-end
- **/full-spec** → Generate a detailed PRD and contract-first API spec
- **/ship** → Review, audit, and document a change for release
- **/demo** → Build a minimal demo with UI flow

## Doc Templates

Located in `/docs-templates/`:

- **PRD.md** → Product Requirements Document
- **ADR.md** → Architecture Decision Record
- **Runbook.md** → Detailed operational guide
- **README-section.md** → README section template
- **Test-Plan.md** → Test plan template

The docs-writer agent can fill these in automatically or you can draft manually.

## Philosophy

Claude Projects Lite is about lean sequencing, not heavy orchestration:

- Agents are plain markdown files
- Commands are just YAML lists
- Docs are just templates

You stay in control and Claude handles the busywork.

## Directory Structure

```
.claude/
  agents/
    architect.md
    planner.md
    product-manager.md
    coder.md
    tester.md
    reviewer.md
    docs-writer.md
    security-auditor.md
    data-modeler.md        # optional
    ui-ux-designer.md      # optional
  commands.yaml
  docs-templates/
    PRD.md
    ADR.md
    Runbook.md
    README-section.md
    Test-Plan.md
```

- `/agents/` → Sub-agent definitions (YAML front-matter + instructions). These
  are the "personas" Claude can switch into
- `commands.yaml` → Slash commands that sequence agents together (like /feature
  or /ship)
- `/docs-templates/` → Markdown skeletons for PRDs, ADRs, runbooks, README
  sections, and test plans
