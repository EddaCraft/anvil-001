---
description: Prime Claude with repo context before a feature run
---

# Prime Repository Context

Analyze and summarize repository context to prepare for feature development:

1. **Repository Summary** - README analysis, architecture patterns, and
   conventions
2. **Decision Context** - Review ADRs and technical choices
3. **Structure Analysis** - Key folders, dependencies, and organization
4. **Open Items** - Identify TODOs, gaps, and immediate opportunities
5. **Next Actions** - Propose prioritized development steps

## Agent Sequence

- **docs-writer**: Summarizes repo context including README, ADRs,
  documentation, and key folder structures
- **planner**: Proposes immediate next steps based on the repository summary and
  identified gaps

## Usage

```
/prime-repo
```

Provides comprehensive repository understanding before starting feature work,
ensuring alignment with existing patterns and conventions.
