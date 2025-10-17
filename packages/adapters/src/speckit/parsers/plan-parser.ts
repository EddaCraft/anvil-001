/**
 * Parser for official GitHub Spec-Kit plan.md format
 *
 * Plan.md focuses on HOW (technical implementation):
 * - Summary
 * - Technical Context (stack, dependencies, constraints)
 * - Constitution Check (compliance with project principles)
 * - Project Structure (directories, files)
 * - Implementation Details (API endpoints, database schema, etc.)
 * - Complexity Tracking (design decisions)
 */

interface PlanMetadata {
  feature?: string;
  branch?: string;
  date?: string;
  spec?: string;
  [key: string]: unknown;
}

interface TechnicalContext {
  language?: string;
  dependencies?: string[];
  storage?: string;
  testing?: string;
  target?: string;
  type?: string;
  performanceGoals?: string[];
  constraints?: string[];
  scale?: string;
}

interface ConstitutionCheck {
  modularity?: boolean | string;
  testability?: boolean | string;
  security?: boolean | string;
  performance?: boolean | string;
  maintainability?: boolean | string;
  documentation?: boolean | string;
  [key: string]: boolean | string | undefined;
}

interface ProjectStructure {
  documentation?: string;
  sourceCode?: string;
  selectedOption?: string;
}

interface ComplexityDecision {
  title: string;
  problem: string;
  solution: string;
  justification: string;
}

export interface ParsedPlan {
  metadata: PlanMetadata;
  summary: string;
  technicalContext: TechnicalContext;
  constitutionCheck: ConstitutionCheck;
  projectStructure: ProjectStructure;
  implementationDetails: Map<string, string>; // Section title -> content
  complexityDecisions: ComplexityDecision[];
}

export class PlanParser {
  parsePlan(content: string): ParsedPlan {
    const result: ParsedPlan = {
      metadata: {},
      summary: '',
      technicalContext: {},
      constitutionCheck: {},
      projectStructure: {},
      implementationDetails: new Map(),
      complexityDecisions: [],
    };

    // Extract metadata from first section
    result.metadata = this.extractMetadata(content);

    // Parse summary section
    result.summary = this.extractSummary(content);

    // Parse technical context
    result.technicalContext = this.parseTechnicalContext(content);

    // Parse constitution check
    result.constitutionCheck = this.parseConstitutionCheck(content);

    // Parse project structure
    result.projectStructure = this.parseProjectStructure(content);

    // Parse implementation details (flexible sections)
    result.implementationDetails = this.parseImplementationDetails(content);

    // Parse complexity tracking
    result.complexityDecisions = this.parseComplexityDecisions(content);

    return result;
  }

  private extractMetadata(content: string): PlanMetadata {
    const metadata: PlanMetadata = {};

    // Extract title (# Implementation Plan: ...)
    const titleMatch = content.match(/^#\s+Implementation Plan:\s+(.+)$/m);
    if (titleMatch) {
      metadata.feature = titleMatch[1].trim();
    }

    // Extract bold key-value pairs
    const metadataRegex = /\*\*([^*]+)\*\*:\s*(?:`([^`\n]+)`|\[([^\]]+)\]\(([^)]+)\)|([^\n]+))/g;
    let match;
    while ((match = metadataRegex.exec(content)) !== null) {
      const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
      const value = match[2] || match[3] || match[5] || '';
      metadata[key] = value.trim();
    }

    return metadata;
  }

  private extractSummary(content: string): string {
    const summaryMatch = content.match(/##\s+Summary\s+([\s\S]*?)(?=\n##\s|$)/i);
    return summaryMatch?.[1]?.trim() || '';
  }

  private parseTechnicalContext(content: string): TechnicalContext {
    const context: TechnicalContext = {};

    const contextMatch = content.match(/##\s+Technical Context([\s\S]*?)(?=\n##\s|$)/i);

    if (!contextMatch) {
      return context;
    }

    const contextSection = contextMatch[1];

    // Parse bullet points with key-value pairs
    const languageMatch = contextSection.match(/[-*]\s+\*\*Language\/Version\*\*:\s+(.+)/i);
    if (languageMatch) {
      context.language = languageMatch[1].trim();
    }

    const storageMatch = contextSection.match(/[-*]\s+\*\*Storage\*\*:\s+(.+)/i);
    if (storageMatch) {
      context.storage = storageMatch[1].trim();
    }

    const testingMatch = contextSection.match(/[-*]\s+\*\*Testing\*\*:\s+(.+)/i);
    if (testingMatch) {
      context.testing = testingMatch[1].trim();
    }

    const targetMatch = contextSection.match(/[-*]\s+\*\*Target\*\*:\s+(.+)/i);
    if (targetMatch) {
      context.target = targetMatch[1].trim();
    }

    const typeMatch = contextSection.match(/[-*]\s+\*\*Type\*\*:\s+(.+)/i);
    if (typeMatch) {
      context.type = typeMatch[1].trim();
    }

    const scaleMatch = contextSection.match(/[-*]\s+\*\*Scale\*\*:\s+(.+)/i);
    if (scaleMatch) {
      context.scale = scaleMatch[1].trim();
    }

    // Parse dependencies (multi-line list)
    const depsMatch = contextSection.match(
      /[-*]\s+\*\*Dependencies\*\*:\s+([\s\S]*?)(?=\n[-*]\s+\*\*|$)/i
    );
    if (depsMatch) {
      const deps = depsMatch[1]
        .split(/\n\s*[-*]\s+/)
        .map((d) => d.trim())
        .filter((d) => d.length > 0);
      context.dependencies = deps;
    }

    // Parse performance goals
    const perfMatch = contextSection.match(
      /[-*]\s+\*\*Performance Goals\*\*:\s+([\s\S]*?)(?=\n[-*]\s+\*\*|$)/i
    );
    if (perfMatch) {
      const goals = perfMatch[1]
        .split(/\n\s*[-*]\s+/)
        .map((g) => g.trim())
        .filter((g) => g.length > 0);
      context.performanceGoals = goals;
    }

    // Parse constraints
    const constraintsMatch = contextSection.match(
      /[-*]\s+\*\*Constraints\*\*:\s+([\s\S]*?)(?=\n[-*]\s+\*\*|$)/i
    );
    if (constraintsMatch) {
      const constraints = constraintsMatch[1]
        .split(/\n\s*[-*]\s+/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      context.constraints = constraints;
    }

    return context;
  }

  private parseConstitutionCheck(content: string): ConstitutionCheck {
    const check: ConstitutionCheck = {};

    const checkMatch = content.match(/##\s+Constitution Check([\s\S]*?)(?=\n##\s|$)/i);

    if (!checkMatch) {
      return check;
    }

    const checkSection = checkMatch[1];

    // Parse ✅ or ❌ followed by **Key**: Description
    const checkRegex = /([✅❌✓✗×])\s+\*\*([^*]+)\*\*:\s+(.+)/g;
    let match;

    while ((match = checkRegex.exec(checkSection)) !== null) {
      const status = match[1];
      const key = match[2].trim().toLowerCase().replace(/\s+/g, '_');
      const description = match[3].trim();

      // Check if it passes or fails
      const passes = status === '✅' || status === '✓';
      check[key] = passes ? description : `FAIL: ${description}`;
    }

    return check;
  }

  private parseProjectStructure(content: string): ProjectStructure {
    const structure: ProjectStructure = {};

    const structureMatch = content.match(/##\s+Project Structure([\s\S]*?)(?=\n##\s|$)/i);

    if (!structureMatch) {
      return structure;
    }

    const structureSection = structureMatch[1];

    // Extract documentation structure (code block)
    const docsMatch = structureSection.match(
      /###\s+Documentation[\s\S]*?```[\s\S]*?\n([\s\S]*?)```/i
    );
    if (docsMatch) {
      structure.documentation = docsMatch[1].trim();
    }

    // Extract source code structure
    const sourceMatch = structureSection.match(
      /###\s+Source Code Structure[\s\S]*?```[\s\S]*?\n([\s\S]*?)```/i
    );
    if (sourceMatch) {
      structure.sourceCode = sourceMatch[1].trim();
    }

    // Check for "Selected" or "(Selected)" marker
    const selectedMatch = structureSection.match(/####\s+Option \d+:([^(]+)\(Selected\)/i);
    if (selectedMatch) {
      structure.selectedOption = selectedMatch[1].trim();
    }

    return structure;
  }

  private parseImplementationDetails(content: string): Map<string, string> {
    const details = new Map<string, string>();

    // Find "Implementation Details" section
    const detailsMatch = content.match(
      /##\s+Implementation Details([\s\S]*?)(?=\n##\s+Complexity|$)/i
    );

    if (!detailsMatch) {
      return details;
    }

    const detailsSection = detailsMatch[1];

    // Split by ### headers
    const subsectionRegex = /###\s+([^\n]+)\n([\s\S]*?)(?=\n###|$)/g;
    let match;

    while ((match = subsectionRegex.exec(detailsSection)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      details.set(title, content);
    }

    return details;
  }

  private parseComplexityDecisions(content: string): ComplexityDecision[] {
    const decisions: ComplexityDecision[] = [];

    // Find "Complexity Tracking" section
    const complexityMatch = content.match(/##\s+Complexity Tracking([\s\S]*?)$/i);

    if (!complexityMatch) {
      return decisions;
    }

    const complexitySection = complexityMatch[1];

    // Split by ### headers (each decision)
    const decisionBlocks = complexitySection.split(/###\s+/).slice(1);

    for (const block of decisionBlocks) {
      const decision = this.parseComplexityDecision(block);
      if (decision) {
        decisions.push(decision);
      }
    }

    return decisions;
  }

  private parseComplexityDecision(block: string): ComplexityDecision | null {
    const titleMatch = block.match(/^([^\n]+)/);
    const problemMatch = block.match(/\*\*Problem\*\*:\s+(.+?)(?=\n\*\*|$)/s);
    const solutionMatch = block.match(/\*\*Solution\*\*:\s+([\s\S]+?)(?=\n\*\*|$)/);
    const justificationMatch = block.match(/\*\*Justification\*\*:\s+([\s\S]+?)(?=\n###|$)/);

    if (!titleMatch) {
      return null;
    }

    return {
      title: titleMatch[1].trim(),
      problem: problemMatch?.[1]?.trim() || '',
      solution: solutionMatch?.[1]?.trim() || '',
      justification: justificationMatch?.[1]?.trim() || '',
    };
  }
}
