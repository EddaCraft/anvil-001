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

See [ADAPTER_GUIDE.md](./ADAPTER_GUIDE.md) for detailed instructions on creating
new adapters.

## API Reference

See [packages/adapters/src/base/](./src/base/) for complete API documentation.

### Key Interfaces

- `FormatAdapter` - Main adapter interface
- `AdapterRegistry` - Adapter registration and lookup
- `ParseResult` - Result of parsing external format to APS
- `SerializeResult` - Result of serializing APS to external format
- `DetectionResult` - Result of format detection

## Supported Formats

### SpecKit (Official Format) ✅

GitHub's official spec-driven development format. Supports the complete spec-kit
workflow with three document types.

- **Extensions**: `spec.md`, `plan.md`, `tasks.md`
- **Status**: Fully implemented
- **Version**: 2.0.0

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

### BMAD (Planned)

Enterprise requirements format.

- **Status**: Planned

## Development

### Running Tests

```bash
pnpm test                # Run all tests
pnpm test:watch          # Watch mode
```

### Type Checking

```bash
pnpm typecheck
```

### Building

```bash
npx nx build adapters
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
