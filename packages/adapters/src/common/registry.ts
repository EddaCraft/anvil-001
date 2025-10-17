import type { SpecToolAdapter, ExternalSpec } from './types.js';

export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<string, SpecToolAdapter> = new Map();

  private constructor() {}

  static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  register(adapter: SpecToolAdapter): void {
    if (this.adapters.has(adapter.name)) {
      throw new Error(`Adapter '${adapter.name}' is already registered`);
    }
    this.adapters.set(adapter.name, adapter);
  }

  unregister(name: string): void {
    this.adapters.delete(name);
  }

  getAdapter(name: string): SpecToolAdapter | undefined {
    return this.adapters.get(name);
  }

  getAdapterForFormat(format: string): SpecToolAdapter | undefined {
    for (const adapter of this.adapters.values()) {
      if (adapter.canImport(format)) {
        return adapter;
      }
    }
    return undefined;
  }

  listAdapters(): ReadonlyArray<SpecToolAdapter> {
    return Array.from(this.adapters.values());
  }

  listAdapterNames(): ReadonlyArray<string> {
    return Array.from(this.adapters.keys());
  }

  listSupportedFormats(): ReadonlyArray<string> {
    const formats = new Set<string>();
    for (const adapter of this.adapters.values()) {
      for (const format of adapter.supportedFormats) {
        formats.add(format);
      }
    }
    return Array.from(formats);
  }

  clear(): void {
    this.adapters.clear();
  }

  detectFormat(spec: ExternalSpec): string | undefined {
    for (const adapter of this.adapters.values()) {
      if (adapter.canImport(spec.format)) {
        return adapter.name;
      }
    }
    return undefined;
  }
}

export const registry = AdapterRegistry.getInstance();
