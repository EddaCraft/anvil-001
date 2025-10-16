# Anvil Format Adapters

Format adapters for converting between external planning formats (SpecKit, BMAD,
etc.) and Anvil Plan Specification (APS).

## Overview

The adapter framework provides a pluggable architecture for working with
different planning document formats. Users can continue using their preferred
format while benefiting from APS validation and gate execution internally.

## Architecture

### Core Concepts

- **FormatAdapter**: Interface for converting between external formats and APS
- **AdapterRegistry**: Central registry for adapter discovery and lookup
- **Auto-detection**: Content-based format detection with confidence scoring
- **Round-trip fidelity**: Parse and serialize maintain document integrity

### Package Structure

```
packages/adapters/
├── src/
│   ├── base/                 # Framework core
│   │   ├── types.ts          # Core interfaces and types
│   │   ├── registry.ts       # Adapter registry
│   │   ├── utils.ts          # Helper utilities
│   │   └── testing.ts        # Testing utilities
│   ├── speckit/              # SpecKit adapter
│   └── bmad/                 # BMAD adapter (future)
└── README.md
```

## Usage

### Using Adapters

```typescript
import { registry } from '@anvil/adapters';
import { SpecKitAdapter } from '@anvil/adapters/speckit';

// Register adapter
const speckit = new SpecKitAdapter();
registry.register(speckit);

// Auto-detect format
const content = await fs.readFile('plan.md', 'utf-8');
const match = registry.detectAdapter(content);

if (match) {
  console.log(`Detected: ${match.adapter.metadata.displayName}`);
  console.log(`Confidence: ${match.detection.confidence}%`);

  // Parse to APS
  const result = await match.adapter.parse(content);
  if (result.success) {
    console.log('Parsed plan:', result.data);
  }
}

// Find adapter by format
const adapter = registry.getAdapterForFormat('speckit');
if (adapter) {
  const result = await adapter.parse(content);
}
```

### Creating Custom Adapters

See [ADAPTER_WORKFLOW_GUIDE.md](./ADAPTER_WORKFLOW_GUIDE.md) for:

- Complete workflow guide with real-world examples
- Technical deep dive into adapter implementation
- Step-by-step guide for adding new adapters
- CLI integration patterns
- Testing strategies

## API Reference

See [packages/adapters/src/base/](./src/base/) for complete API documentation.

### Key Interfaces

- `FormatAdapter` - Main adapter interface
- `AdapterRegistry` - Adapter registration and lookup
- `ParseResult` - Result of parsing external format to APS
- `SerializeResult` - Result of serializing APS to external format
- `DetectionResult` - Result of format detection

## Supported Formats

### SpecKit ✅ COMPLETE

GitHub's official spec-driven development format. Supports the complete spec-kit
workflow with three document types.

- **Extensions**: `spec.md`, `plan.md`, `tasks.md`
- **Status**: ✅ Fully implemented (October 2025)
- **Version**: 2.0.0
- **Code**: ~2,469 lines
- **Tests**: 51 tests (49 passing, 2 minor fixes pending)
- **Coverage**: >95%

#### Document Types

**spec.md** - Requirements and user scenarios (WHAT and WHY)

- Feature metadata (branch, date, status)
- User scenarios & testing (prioritized user stories with acceptance criteria)
- Functional requirements (testable requirements with clarification markers)
- Key entities (data model definitions)
- Success criteria (quantitative and qualitative metrics)

**plan.md** - Technical implementation (HOW)

- Summary of technical approach
- Technical context (language, dependencies, constraints)
- Constitution check (compliance with project principles)
- Project structure (directory layout, file organization)
- Implementation details (API endpoints, database schema, etc.)
- Complexity tracking (design decisions and justifications)

**tasks.md** - Executable breakdown

- Tasks organized by phases with IDs
- Parallel execution markers
- Checkpoints after each phase
- Dependencies and execution order
- Implementation strategies

#### Usage Example

```typescript
import { SpecKitImportAdapterV2 } from '@anvil/adapters/speckit';

const adapter = new SpecKitImportAdapterV2();

// Import complete spec-kit feature directory
const result = await adapter.convertToAPS({
  format: 'speckit',
  version: '2.0.0',
  content: {
    spec: { content: specMdContent },
    plan: { content: planMdContent },
    tasks: { content: tasksMdContent },
  },
});

if (result.success) {
  // APS plan with full metadata from all documents
  const plan = result.data;

  // Access spec.md data
  console.log(plan.metadata?.userScenarios);
  console.log(plan.metadata?.clarifications);

  // Access plan.md data
  console.log(plan.metadata?.technicalContext);
  console.log(plan.metadata?.implementationDetails);

  // Access tasks.md data
  console.log(plan.metadata?.phases);
  console.log(plan.metadata?.taskDependencies);
}
```

#### APS Mapping

- **User Scenarios** → `proposed_changes` with scenario metadata (user story,
  acceptance criteria, edge cases)
- **Functional Requirements** → `metadata.requirements.functional[]`
- **Key Entities** → `metadata.requirements.entities[]`
- **Success Criteria** → `metadata.successCriteria`
- **Clarifications** → `metadata.clarifications[]` (all `[NEEDS CLARIFICATION]`
  markers)
- **Technical Context** → `metadata.technicalContext`
- **Project Structure** → `metadata.projectStructure`
- **Implementation Details** → `metadata.implementationDetails`
- **Phases & Tasks** → `metadata.phases[]`, `metadata.taskDependencies[]`

### BMAD ⏳ PLANNED

Business Model and Architecture Document format - enterprise requirements and
PRD format.

- **Extensions**: `.md` (PRD format)
- **Status**: ⏳ Not yet implemented (planned for Week 5-6)
- **Target**: November 2025

#### Expected Document Structure

BMAD documents typically include:

- Problem Statement → APS `intent`
- Functional Requirements (REQ-XXX format) → APS `proposed_changes[]`
- Non-Functional Requirements (PERF-XXX, SEC-XXX) → APS `metadata.nfr[]`
- Architecture section → APS `metadata.architecture`
- Acceptance Criteria → APS `metadata.acceptance_criteria[]`

## Development

### Running Tests

```bash
pnpm test                # Run all tests (51 tests)
pnpm test:watch          # Watch mode
pnpm test:coverage       # Run with coverage report
```

**Current Test Status** (as of October 2025):

- Total: 51 tests
- Passing: 49 tests
- Failing: 2 tests (minor spec-parser fixes needed)
- Coverage: >95%

### Type Checking

```bash
pnpm typecheck
```

### Building

```bash
npx nx build adapters
```

### Project Structure

```
packages/adapters/
├── src/
│   ├── base/                     # Framework core (586 LOC)
│   │   ├── types.ts              # FormatAdapter interface, base classes
│   │   ├── registry.ts           # Adapter registry with detection
│   │   ├── utils.ts              # Helper utilities
│   │   ├── testing.ts            # Testing utilities
│   │   └── __tests__/
│   │       └── registry.test.ts  # 22 tests (100% passing)
│   ├── common/                   # Legacy adapter types (deprecated)
│   │   ├── types.ts              # Old SpecToolAdapter interface
│   │   ├── registry.ts           # Old registry implementation
│   │   └── index.ts
│   ├── speckit/                  # SpecKit adapter (2,469 LOC)
│   │   ├── index.ts              # Exports
│   │   ├── parser.ts             # Core markdown parser (330 LOC)
│   │   ├── import.ts             # V1 import adapter (284 LOC)
│   │   ├── import-v2.ts          # V2 official format (424 LOC)
│   │   ├── export.ts             # Export adapter (462 LOC)
│   │   └── parsers/              # Specialized parsers (966 LOC)
│   │       ├── spec-parser.ts    # Spec.md parser (378 LOC)
│   │       ├── plan-parser.ts    # Plan.md parser (342 LOC)
│   │       └── tasks-parser.ts   # Tasks.md parser (246 LOC)
│   ├── __tests__/                # Test suite
│   │   ├── fixtures/             # Test fixtures
│   │   │   ├── speckit/          # Sample SpecKit documents
│   │   │   ├── speckit-official/ # Official spec-kit examples
│   │   │   └── aps/              # APS test fixtures
│   │   ├── speckit-import.test.ts       # V1 import tests
│   │   ├── speckit-import-v2.test.ts    # V2 import tests
│   │   ├── speckit-export.test.ts       # Export tests
│   │   ├── speckit-parser.test.ts       # Core parser tests
│   │   └── speckit-spec-parser.test.ts  # Spec parser tests
│   └── index.ts                  # Main package exports
└── README.md                     # This file
```

## Design Principles

1. **Format Agnostic**: Users work with their preferred format
2. **APS Internal**: Validation and execution always use APS
3. **Round-trip Fidelity**: Parse → Serialize → Parse preserves intent
4. **Content Detection**: Auto-detect format from content
5. **Extensible**: Easy to add new format adapters
6. **Type Safe**: Full TypeScript support

## License

MIT
