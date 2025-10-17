---
description: Break down and implement a new feature end-to-end
---

# Feature Development Workflow

Complete feature implementation from planning through testing:

1. **Planning & Breakdown** - Structured task decomposition with success
   criteria
2. **Architecture Design** - Interface contracts and implementation approach
3. **Implementation** - Clean, minimal code changes following existing patterns
4. **Code Review** - Quality assurance and maintainability checks
5. **Testing** - Comprehensive test coverage and validation

## Agent Sequence

- **planner**: Breaks feature into actionable steps with clear success criteria
  and risk assessment
- **architect**: Defines interfaces, data changes, file modifications, and
  guardrails
- **coder**: Implements the minimal viable change with clean, typed code
- **reviewer**: Performs pragmatic code review focusing on correctness and
  maintainability
- **tester**: Creates test plans and implements comprehensive test coverage

## Usage

```
/feature "user profile photo upload with resizing"
```

Each agent provides structured handoffs, allowing you to review and adjust at
any step.
