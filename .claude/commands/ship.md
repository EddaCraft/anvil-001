---
description: Review, audit, and document a change for release
---

# Ship Preparation Workflow

Comprehensive release preparation with quality gates:

1. **Code Review** - Final review for correctness, maintainability, and
   performance
2. **Security Audit** - Authentication, authorization, PII, and dependency
   scanning
3. **Documentation** - Release notes, runbooks, and operational guides

## Agent Sequence

- **reviewer**: Performs final code review with approve/request changes decision
- **security-auditor**: Checks authentication/authorization, input validation,
  secrets handling, dependency risks, and PII logging
- **docs-writer**: Updates documentation using templates from
  `.claude/docs-templates/`

## Usage

```
/ship
```

Run this command when your feature branch is ready for production deployment.

## Quality Gates

The workflow includes automated checks for:

- Code quality and maintainability
- Security vulnerabilities and best practices
- Comprehensive documentation
- Operational readiness

## Output Artifacts

- Code review report with actionable feedback
- Security audit checklist with must-fix items
- Updated README sections, ADRs, and runbooks
