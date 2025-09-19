# RFC: Adoption of Specification Tools for Anvil APS

**Status**: Draft  
**Author**: Claude AI Assistant  
**Date**: 2024-01-15  
**Version**: 1.0  

## Summary

This RFC evaluates the adoption of external specification tools to enhance Anvil's Application Programming Specification (APS) capabilities. We assess two primary options: GitHub Spec-kit and BMAD-METHOD, considering their alignment with Anvil's deterministic development automation platform goals.

## Background

Anvil is a deterministic development automation platform that enforces quality gates and manages infrastructure-as-code through validated, reproducible plans. The project is currently in Phase 1 development, focusing on core APS (Anvil Plan Spec) schema, validation, and CLI implementation.

### Current APS Implementation

Based on the project documentation, Anvil's APS includes:

- **Schema Structure**: JSON Schema 2020-12 format with deterministic hash generation
- **Core Fields**: ID, hash, intent, proposed_changes, provenance, validations
- **Validation**: Schema validation, hash verification, quality gate enforcement
- **CLI Commands**: `plan`, `validate`, `export` for plan management

### Project Goals

- Deterministic, validated development plans
- Quality gate enforcement across basic checks
- Sidecar runtime for development flow arbitration
- Modular feature bootstrapping through packs
- Production-ready repository governance

## Options Analysis

### Option 1: GitHub Spec-kit

**Overview**: A toolkit for Spec-Driven Development (SDD) that treats specifications as executable entities that directly generate working implementations.

**Key Features**:
- `/specify` command for project requirements definition
- `/plan` command for technical implementation planning
- `/tasks` command for actionable task breakdown
- Focus on product scenarios over undifferentiated code
- GitHub ecosystem integration

**Alignment with Anvil**:
- ✅ **Specification-first approach**: Aligns with APS's schema-driven design
- ✅ **Executable specifications**: Complements Anvil's deterministic plan execution
- ✅ **Structured workflow**: Matches Anvil's phase-based development approach
- ⚠️ **GitHub dependency**: May limit flexibility for non-GitHub users
- ⚠️ **Limited AI integration**: Less sophisticated than BMAD-METHOD's agentic approach

### Option 2: BMAD-METHOD

**Overview**: Breakthrough Method for Agile AI-Driven Development with agentic planning and context-engineered development.

**Key Features**:
- **Agentic Planning**: AI agents (Analyst, PM, Architect) collaborate on PRDs and architecture
- **Context-Engineered Development**: Scrum Master agent creates hyper-detailed development stories
- **AI-driven workflow**: Advanced prompt engineering and human-in-the-loop refinement
- **Tool-agnostic**: Works with various development environments
- **Expansion packs**: Customizable for different domains

**Alignment with Anvil**:
- ✅ **AI-driven approach**: Enhances Anvil's automation capabilities
- ✅ **Detailed specifications**: Complements APS's comprehensive validation requirements
- ✅ **Tool-agnostic**: Fits Anvil's platform-agnostic goals
- ✅ **Context preservation**: Aligns with Anvil's deterministic approach
- ⚠️ **Complexity**: May introduce overhead for simpler use cases
- ⚠️ **Learning curve**: Requires team training on AI agent management

### Option 3: Hybrid Approach

**Overview**: Provide both tools as optional integrations, allowing users to choose based on their needs.

**Implementation Strategy**:
- Core APS remains tool-agnostic
- Plugin architecture for specification tool integration
- User-configurable specification generation workflows
- Fallback to native APS when external tools not available

## Recommendation

### Primary Recommendation: Hybrid Approach with BMAD-METHOD Focus

**Rationale**:

1. **Strategic Alignment**: BMAD-METHOD's AI-driven approach better aligns with Anvil's automation platform vision
2. **Flexibility**: Hybrid approach accommodates different user preferences and use cases
3. **Future-Proofing**: AI-driven development is becoming increasingly important
4. **Complementary Strengths**: Each tool addresses different aspects of specification management

### Implementation Plan

#### Phase 1: Core Integration (Weeks 1-2)
- Implement plugin architecture for specification tools
- Create BMAD-METHOD integration adapter
- Maintain native APS as fallback option

#### Phase 2: GitHub Spec-kit Integration (Weeks 3-4)
- Add GitHub Spec-kit integration adapter
- Implement user preference configuration
- Create migration tools between specification formats

#### Phase 3: Enhanced Workflows (Weeks 5-6)
- Develop unified CLI commands that work with both tools
- Create specification format conversion utilities
- Implement validation across all specification formats

### Technical Implementation

#### Plugin Architecture

```typescript
// Define more specific types for context and external spec
interface SpecContext {
  // Add relevant context fields here
  [key: string]: unknown;
}

interface ExternalSpec {
  // Add relevant external spec fields here
  [key: string]: unknown;
}

interface SpecToolAdapter {
  name: string;
  version: string;
  generateSpec(intent: string, context: SpecContext): Promise<APSSpec>;
  validateSpec(spec: APSSpec): Promise<ValidationResult>;
  convertToAPS(spec: ExternalSpec): APSSpec;
}

class BMADMethodAdapter implements SpecToolAdapter {
  // BMAD-METHOD specific implementation
}

class GitHubSpecKitAdapter implements SpecToolAdapter {
  // GitHub Spec-kit specific implementation
}
```

#### CLI Enhancements

```bash
# New commands
anvil spec generate --tool bmad "Add authentication to the application"
anvil spec generate --tool github-spec-kit "Add authentication to the application"
anvil spec convert --from bmad --to aps plan.json
anvil spec validate --tool bmad plan.json
```

#### Configuration Options

```yaml
# .anvilrc
spec_tools:
  default: "bmad"  # or "github-spec-kit" or "native"
  enabled:
    - "bmad"
    - "github-spec-kit"
    - "native"
  
bmad:
  agents:
    analyst: "gpt-4"
    pm: "gpt-4"
    architect: "gpt-4"
    scrum_master: "gpt-4"
  
github_spec_kit:
  repository: "github.com/org/repo"
  branch: "main"
```

## Benefits

### Immediate Benefits
- **Enhanced Specification Quality**: AI-driven planning produces more comprehensive specifications
- **User Choice**: Teams can select the tool that best fits their workflow
- **Backward Compatibility**: Existing APS functionality remains unchanged

### Long-term Benefits
- **AI Integration**: Positions Anvil as a modern, AI-enhanced development platform
- **Ecosystem Growth**: Plugin architecture enables future tool integrations
- **Competitive Advantage**: Unique combination of deterministic plans with AI-driven specification generation

## Risks and Mitigations

### Risks
1. **Complexity Increase**: Additional tools may complicate the user experience
2. **Maintenance Overhead**: Supporting multiple integration points
3. **Dependency Management**: External tool dependencies and versioning

### Mitigations
1. **Progressive Enhancement**: Core functionality remains simple, advanced features are optional
2. **Modular Design**: Clean separation between core APS and tool integrations
3. **Version Pinning**: Lock external tool versions and provide update mechanisms

## Success Metrics

### Technical Metrics
- [ ] Plugin architecture successfully implemented
- [ ] Both tools integrated with <5% performance impact
- [ ] 100% backward compatibility with existing APS
- [ ] All existing tests pass with new integrations

### User Experience Metrics
- [ ] User satisfaction with specification quality (target: >4.5/5)
- [ ] Adoption rate of AI-driven specifications (target: >60% of users)
- [ ] Time to generate specifications (target: <30% reduction)

## Alternative Considerations

### Option A: Native AI Enhancement
Instead of external tools, enhance Anvil's native APS with AI capabilities:
- **Pros**: Full control, no external dependencies, optimized for Anvil
- **Cons**: Significant development effort, reinventing existing solutions

### Option B: Single Tool Adoption
Choose only one tool (likely BMAD-METHOD):
- **Pros**: Simpler implementation, focused development effort
- **Cons**: Limits user choice, may not fit all use cases

## Conclusion

The hybrid approach with BMAD-METHOD focus provides the best balance of innovation, flexibility, and strategic alignment with Anvil's goals. This approach positions Anvil as a forward-thinking platform while maintaining the simplicity and reliability that users expect.

The implementation should be phased to minimize risk while maximizing value delivery. The plugin architecture ensures that the core APS remains stable while enabling future enhancements and integrations.

## Next Steps

1. **Stakeholder Review**: Present this RFC to the development team and key stakeholders
2. **Technical Spike**: Implement proof-of-concept plugin architecture
3. **User Research**: Survey potential users about their specification tool preferences
4. **Implementation Planning**: Create detailed technical specifications for Phase 1
5. **Resource Allocation**: Determine team capacity and timeline for implementation

---

**Appendices**

### Appendix A: Detailed Feature Comparison

| Feature | Native APS | GitHub Spec-kit | BMAD-METHOD |
|---------|------------|-----------------|-------------|
| Schema Validation | ✅ | ✅ | ✅ |
| Hash Verification | ✅ | ❌ | ❌ |
| AI Integration | ❌ | ⚠️ | ✅ |
| GitHub Integration | ❌ | ✅ | ⚠️ |
| Tool Agnostic | ✅ | ❌ | ✅ |
| Learning Curve | Low | Medium | High |
| Customization | High | Medium | High |

### Appendix B: Implementation Timeline

```
Week 1-2: Plugin Architecture + BMAD-METHOD Integration
Week 3-4: GitHub Spec-kit Integration
Week 5-6: Enhanced Workflows + Testing
Week 7-8: Documentation + User Training
Week 9-10: Production Deployment + Monitoring
```

### Appendix C: Resource Requirements

- **Development**: 2-3 developers for 10 weeks
- **Testing**: 1 QA engineer for integration testing
- **Documentation**: 1 technical writer for user guides
- **Infrastructure**: Minimal additional resources required