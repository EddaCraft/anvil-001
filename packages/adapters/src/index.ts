export * from './common/index.js';
export * from './speckit/index.js';

// Auto-register adapters when module is imported
import { registry } from './common/index.js';
import { SpecKitImportAdapter, SpecKitExportAdapter } from './speckit/index.js';

// Register default adapters
registry.register(new SpecKitImportAdapter());
registry.register(new SpecKitExportAdapter());
