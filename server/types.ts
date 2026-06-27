// Shared domain types for the teaching-design workbench.
// Mirrored by client/src/types.ts (kept duplicated on purpose: client and
// server are independent packages and must not import across the boundary).

export type ApiStep =
  | "start"
  | "standard-analysis"
  | "goals"
  | "evidence"
  | "task-chain"
  | "support-quality"
  | "final-lesson";

export type Provider = "mock" | "openai" | "anthropic" | "dify";

export interface DesignInput {
  subject: string;
  grade: string;
  standard: string;
  topic: string;
  duration: string;
  studentBase: string;
  difficulty: string;
}

export interface StandardAnalysis {
  keywords: string[];
  coreAbilities: string[];
  observablePerformances: string[];
  riskWarnings: string[];
}

export interface Goals {
  basicGoal: string;
  coreGoal: string;
  challengeGoal: string;
}

export interface Evidence {
  goal: string;
  studentEvidence: string;
  criteria: string;
  possibleMisunderstanding: string;
}

export interface TaskItem {
  name: string;
  teacherInstruction: string;
  studentAction: string;
  classroomOutput: string;
  alignedGoal: string;
}

export interface Support {
  lowSupport: string;
  middleSupport: string;
  highChallenge: string;
}

export interface QualityItem {
  dimension: string;
  status: "通过" | "需优化" | "风险";
  comment: string;
  suggestion: string;
}

export interface Results {
  standard?: StandardAnalysis;
  goals?: Goals;
  evidence?: Evidence[];
  tasks?: TaskItem[];
  support?: Support;
  quality?: QualityItem[];
}

export interface GenerateRequest {
  step: ApiStep;
  input: DesignInput;
  draft: Partial<Results>;
}

export interface GenerateResponse {
  success: boolean;
  mode: Provider;
  step: ApiStep;
  data: unknown;
  fallback?: boolean;
  message?: string;
}
