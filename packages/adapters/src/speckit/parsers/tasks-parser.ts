/**
 * Parser for official GitHub Spec-Kit tasks.md format
 *
 * Tasks.md breaks down work into executable tasks:
 * - Tasks organized by phases
 * - Task IDs for tracking
 * - Parallel execution markers
 * - Dependencies and execution order
 * - Implementation strategies
 */

interface TasksMetadata {
  feature?: string;
  branch?: string;
  date?: string;
  spec?: string;
  plan?: string;
  [key: string]: unknown;
}

interface Task {
  id: string;
  parallel: boolean;
  userStory?: string;
  description: string;
}

interface Phase {
  name: string;
  order: number;
  tasks: Task[];
  checkpoint?: string;
}

interface Dependency {
  description: string;
  requiredBefore?: string[];
  canRunInParallel?: boolean;
}

interface ImplementationStrategy {
  name: string;
  description: string;
  recommended?: boolean;
}

export interface ParsedTasks {
  metadata: TasksMetadata;
  phases: Phase[];
  dependencies: Dependency[];
  strategies: ImplementationStrategy[];
}

export class TasksParser {
  parseTasks(content: string): ParsedTasks {
    const result: ParsedTasks = {
      metadata: {},
      phases: [],
      dependencies: [],
      strategies: [],
    };

    // Extract metadata
    result.metadata = this.extractMetadata(content);

    // Parse phases and tasks
    result.phases = this.parsePhases(content);

    // Parse dependencies section
    result.dependencies = this.parseDependencies(content);

    // Parse implementation strategies
    result.strategies = this.parseStrategies(content);

    return result;
  }

  private extractMetadata(content: string): TasksMetadata {
    const metadata: TasksMetadata = {};

    // Extract title (# Tasks: ...)
    const titleMatch = content.match(/^#\s+Tasks:\s+(.+)$/m);
    if (titleMatch) {
      metadata.feature = titleMatch[1].trim();
    }

    // Extract bold key-value pairs with links
    const metadataRegex = /\*\*([^*]+)\*\*:\s*(?:`([^`\n]+)`|\[([^\]]+)\]\(([^)]+)\)|([^\n|]+))/g;
    let match;
    while ((match = metadataRegex.exec(content)) !== null) {
      const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
      const value = match[2] || match[3] || match[5] || '';
      metadata[key] = value.trim();
    }

    return metadata;
  }

  private parsePhases(content: string): Phase[] {
    const phases: Phase[] = [];

    // Match ## Phase N: Name sections
    const phaseRegex =
      /##\s+Phase\s+(\d+):\s+([^\n]+)([\s\S]*?)(?=\n##\s+(?:Phase|Dependencies)|$)/gi;
    let match;

    while ((match = phaseRegex.exec(content)) !== null) {
      const order = parseInt(match[1], 10);
      const name = match[2].trim();
      const phaseContent = match[3];

      const tasks = this.parseTaskItems(phaseContent);
      const checkpoint = this.extractCheckpoint(phaseContent);

      phases.push({
        name,
        order,
        tasks,
        checkpoint,
      });
    }

    return phases;
  }

  private parseTaskItems(content: string): Task[] {
    const tasks: Task[] = [];

    // Match task lines: - [ID] [P?] [Story?] Description
    // Format: - [001] Description
    //     or: - [001] [P] Description
    //     or: - [001] [P] [Story] Description
    const taskRegex = /[-*]\s+\[(\d+)\](?:\s+\[P\])?(?:\s+\[([^\]]+)\])?\s+(.+)/g;
    let match;

    while ((match = taskRegex.exec(content)) !== null) {
      const id = match[1];
      const userStory = match[2]?.trim();
      const description = match[3].trim();

      // Check if [P] marker exists (for parallel execution)
      const lineMatch = content.match(new RegExp(`\\[${id}\\]\\s+\\[P\\]`, 'i'));
      const parallel = !!lineMatch;

      tasks.push({
        id,
        parallel,
        userStory,
        description,
      });
    }

    return tasks;
  }

  private extractCheckpoint(content: string): string | undefined {
    const checkpointMatch = content.match(/\*\*Checkpoint\*\*:\s+(.+)/i);
    return checkpointMatch?.[1]?.trim();
  }

  private parseDependencies(content: string): Dependency[] {
    const dependencies: Dependency[] = [];

    // Find "Dependencies & Execution Order" section
    const depsMatch = content.match(
      /##\s+Dependencies\s*(?:&|and)?\s*Execution Order([\s\S]*?)(?=\n##\s|$)/i
    );

    if (!depsMatch) {
      return dependencies;
    }

    const depsSection = depsMatch[1];

    // Parse subsections (### Required Sequential Order, ### Parallel Work Opportunities)
    const subsections = depsSection.split(/###\s+/).slice(1);

    for (const subsection of subsections) {
      const lines = subsection.split('\n');
      const title = lines[0].trim();

      const items: string[] = [];
      for (const line of lines.slice(1)) {
        const itemMatch = line.match(/^[-*]\s+(.+)/);
        if (itemMatch) {
          items.push(itemMatch[1].trim());
        }
      }

      if (items.length > 0) {
        dependencies.push({
          description: title,
          requiredBefore: title.toLowerCase().includes('sequential') ? items : undefined,
          canRunInParallel: title.toLowerCase().includes('parallel'),
        });
      }
    }

    return dependencies;
  }

  private parseStrategies(content: string): ImplementationStrategy[] {
    const strategies: ImplementationStrategy[] = [];

    // Find "Implementation Strategies" section
    const strategiesMatch = content.match(/##\s+Implementation Strategies([\s\S]*?)$/i);

    if (!strategiesMatch) {
      return strategies;
    }

    const strategiesSection = strategiesMatch[1];

    // Parse ### Strategy N: Name
    const strategyRegex = /###\s+Strategy\s+\d+:\s+([^\n]+)([\s\S]*?)(?=\n###|$)/gi;
    let match;

    while ((match = strategyRegex.exec(strategiesSection)) !== null) {
      const name = match[1].trim();
      const description = match[2].trim();

      // Check if recommended
      const recommended = strategiesSection.toLowerCase().includes(`recommended`);

      strategies.push({
        name,
        description,
        recommended: recommended && match[0].toLowerCase().includes('recommended'),
      });
    }

    // Extract recommended strategy
    const recommendedMatch = strategiesSection.match(/\*\*Recommended\*\*:\s+([^.]+)/i);
    if (recommendedMatch) {
      const recommendedName = recommendedMatch[1].trim();
      const strategy = strategies.find((s) =>
        recommendedName.toLowerCase().includes(s.name.toLowerCase())
      );
      if (strategy) {
        strategy.recommended = true;
      }
    }

    return strategies;
  }
}
