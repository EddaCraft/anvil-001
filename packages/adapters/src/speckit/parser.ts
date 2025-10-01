interface MarkdownSection {
  title: string;
  level: number;
  content: string;
  subsections: MarkdownSection[];
}

interface ParsedSpecKit {
  intent?: string;
  overview?: string;
  goals?: string[];
  requirements?: string[];
  changes?: Array<{
    type: string;
    description: string;
    path?: string;
    content?: string;
  }>;
  metadata?: Record<string, unknown>;
}

export class SpecKitParser {
  private static readonly SPEC_SECTIONS = {
    intent: ['intent', 'purpose', 'objective'],
    overview: ['overview', 'summary', 'description'],
    goals: ['goals', 'objectives', 'outcomes'],
    requirements: ['requirements', 'prerequisites', 'dependencies'],
    changes: ['changes', 'modifications', 'alterations', 'tasks'],
  } as const;

  parseSpecMarkdown(content: string): ParsedSpecKit {
    const sections = this.parseMarkdownSections(content);
    const result: ParsedSpecKit = {
      metadata: {},
    };

    for (const section of sections) {
      this.extractSectionData(section, result);
    }

    return result;
  }

  private parseMarkdownSections(content: string): MarkdownSection[] {
    const lines = content.split('\n');
    const sections: MarkdownSection[] = [];
    const stack: MarkdownSection[] = [];
    let currentContent: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headerMatch) {
        if (currentContent.length > 0 && stack.length > 0) {
          stack[stack.length - 1].content = currentContent.join('\n').trim();
        }

        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();

        const newSection: MarkdownSection = {
          title,
          level,
          content: '',
          subsections: [],
        };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          sections.push(newSection);
        } else {
          stack[stack.length - 1].subsections.push(newSection);
        }

        stack.push(newSection);
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentContent.length > 0 && stack.length > 0) {
      stack[stack.length - 1].content = currentContent.join('\n').trim();
    }

    return sections;
  }

  private extractSectionData(section: MarkdownSection, result: ParsedSpecKit): void {
    const sectionTitleLower = section.title.toLowerCase();

    for (const [key, aliases] of Object.entries(SpecKitParser.SPEC_SECTIONS)) {
      if (aliases.some((alias) => sectionTitleLower.includes(alias))) {
        switch (key) {
          case 'intent':
            // For intent, get only the paragraph text, not list items
            result.intent = this.extractParagraphText(section.content);
            break;
          case 'overview':
            // For overview, get only the paragraph text, not list items
            result.overview = this.extractParagraphText(section.content);
            break;
          case 'goals':
            result.goals = this.parseListItems(section.content);
            break;
          case 'requirements':
            result.requirements = this.parseListItems(section.content);
            break;
          case 'changes':
            result.changes = this.parseChanges(section);
            break;
        }
      }
    }

    for (const subsection of section.subsections) {
      this.extractSectionData(subsection, result);
    }
  }

  private extractParagraphText(content: string): string {
    const lines = content.split('\n');
    const paragraphLines: string[] = [];
    let hasContent = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Stop at list items
      if (trimmedLine.match(/^[-*+]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
        break;
      }

      // Add non-empty lines
      if (trimmedLine) {
        paragraphLines.push(trimmedLine);
        hasContent = true;
      } else if (hasContent && paragraphLines.length > 0) {
        // Stop at empty line after we've collected some content
        break;
      }
    }

    return paragraphLines.join(' ').trim();
  }

  private parseListItems(content: string): string[] {
    const lines = content.split('\n');
    const items: string[] = [];
    let currentItem = '';

    for (const line of lines) {
      const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
      const numberedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

      if (listMatch || numberedMatch) {
        if (currentItem) {
          items.push(currentItem.trim());
        }
        currentItem = (listMatch?.[1] || numberedMatch?.[1] || '').trim();
      } else if (currentItem && line.trim()) {
        currentItem += ' ' + line.trim();
      }
    }

    if (currentItem) {
      items.push(currentItem.trim());
    }

    return items;
  }

  private parseChanges(section: MarkdownSection): Array<{
    type: string;
    description: string;
    path?: string;
    content?: string;
  }> {
    const changes: Array<{
      type: string;
      description: string;
      path?: string;
      content?: string;
    }> = [];

    // Process direct subsections
    for (const subsection of section.subsections) {
      // Check if this subsection is a grouping section (like "Files to Create")
      const subsectionTitleLower = subsection.title.toLowerCase();
      const isGroupingSection =
        subsectionTitleLower.includes('files to') ||
        subsectionTitleLower.includes('configuration') ||
        subsectionTitleLower.includes('dependencies') ||
        subsectionTitleLower.includes('scripts');

      if (isGroupingSection && subsection.subsections.length > 0) {
        // Process nested subsections within grouping sections
        for (const nestedSection of subsection.subsections) {
          const change = this.parseChangeSection(nestedSection);
          if (change) {
            changes.push(change);
          }
        }
      } else {
        // Process as a direct change section
        const change = this.parseChangeSection(subsection);
        if (change) {
          changes.push(change);
        }
      }
    }

    // Fallback to parsing list items if no subsections found
    if (changes.length === 0) {
      const listItems = this.parseListItems(section.content);
      for (const item of listItems) {
        const change = this.parseChangeFromListItem(item);
        if (change) {
          changes.push(change);
        }
      }
    }

    return changes;
  }

  private parseChangeSection(section: MarkdownSection): {
    type: string;
    description: string;
    path?: string;
    content?: string;
  } | null {
    const titleLower = section.title.toLowerCase();
    let type = 'script_execute';

    if (titleLower.includes('create') || titleLower.includes('new')) {
      type = 'file_create';
    } else if (titleLower.includes('update') || titleLower.includes('modify')) {
      type = 'file_update';
    } else if (titleLower.includes('delete') || titleLower.includes('remove')) {
      type = 'file_delete';
    } else if (titleLower.includes('config')) {
      type = 'config_update';
    } else if (titleLower.includes('dependency') || titleLower.includes('package')) {
      if (titleLower.includes('add') || titleLower.includes('install')) {
        type = 'dependency_add';
      } else if (titleLower.includes('remove') || titleLower.includes('uninstall')) {
        type = 'dependency_remove';
      } else {
        type = 'dependency_update';
      }
    }

    // Look for path in title first, then in content
    let pathMatch = section.title.match(/`([^`]+)`/);
    if (!pathMatch && section.content) {
      // Look for path in the first line of content
      const firstLine = section.content.split('\n')[0];
      pathMatch = firstLine.match(/`([^`]+)`/);
    }
    const path = pathMatch ? pathMatch[1] : undefined;

    const codeBlockMatch = section.content.match(/```[\w]*\n([\s\S]*?)```/);
    const content = codeBlockMatch ? codeBlockMatch[1].trim() : undefined;

    return {
      type,
      description: section.title,
      path,
      content,
    };
  }

  private parseChangeFromListItem(item: string): {
    type: string;
    description: string;
    path?: string;
  } | null {
    const itemLower = item.toLowerCase();
    let type = 'script_execute';

    // Check for script execution patterns first
    if (
      itemLower.includes('run') ||
      itemLower.includes('execute') ||
      itemLower.includes('script')
    ) {
      type = 'script_execute';
    } else if (itemLower.includes('create') || itemLower.includes('new file')) {
      type = 'file_create';
    } else if (itemLower.includes('delete') || itemLower.includes('remove file')) {
      type = 'file_delete';
    } else if (itemLower.includes('update dependency')) {
      type = 'dependency_update';
    } else if (itemLower.includes('install') || itemLower.includes('add dependency')) {
      type = 'dependency_add';
    } else if (itemLower.includes('uninstall') || itemLower.includes('remove dependency')) {
      type = 'dependency_remove';
    } else if (itemLower.includes('update') || itemLower.includes('modify')) {
      type = 'file_update';
    } else if (itemLower.includes('config')) {
      type = 'config_update';
    }

    const pathMatch = item.match(/`([^`]+)`/);
    const path = pathMatch ? pathMatch[1] : undefined;

    return {
      type,
      description: item,
      path,
    };
  }
}
