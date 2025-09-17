export interface GateCheck {
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface GateResult {
  check: string;
  passed: boolean;
  score?: number;
  message: string;
  details?: any;
  error?: string;
  skipped?: boolean;
}

export interface GateRunResult {
  overall: boolean;
  score: number;
  checks: GateResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

export interface GateConfig {
  version: number;
  checks: GateCheck[];
  thresholds: {
    overall_score: number;
    [key: string]: number;
  };
  global_config?: Record<string, any>;
}

export interface PlanData {
  id: string;
  intent: string;
  proposed_changes: Array<{
    type: string;
    target: string;
    action: string;
    content: any;
  }>;
  provenance: {
    created_at: string;
    created_by: string;
    version: string;
  };
  validations?: {
    required_checks: string[];
    thresholds: Record<string, number>;
  };
}

export interface CheckContext {
  plan: PlanData;
  workspace_root: string;
  config: GateConfig;
  check_config: Record<string, any>;
}