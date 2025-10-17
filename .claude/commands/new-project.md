---
description: Scaffold a full repo with PRD, architecture, stubs, docs, and tests
---

# New Project Scaffolding

Creates a complete project foundation with:

1. **Product Requirements Document** - Clear problem definition and success
   criteria
2. **System Architecture** - Technical design and implementation approach
3. **Code Stubs** - Basic project structure with key files
4. **Documentation** - README sections and operational guides
5. **Test Framework** - Initial test structure and examples

## Agent Sequence

- **product-manager**: Creates comprehensive PRD with user stories and
  acceptance criteria
- **architect**: Designs system structure, interfaces, and technical approach
- **coder**: Implements basic project scaffolding and core structure
- **docs-writer**: Creates documentation using templates from
  `.claude/docs-templates/`
- **tester**: Sets up testing framework and initial test cases

## Usage

```
/new-project "social media analytics dashboard"
```

The sequence will produce a complete project foundation ready for development.
