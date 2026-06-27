// Client-side domain types (mirrors server/types.ts). Kept duplicated so the
// client package has zero dependency on the server.

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

export interface GenerateResponse {
  success: boolean;
  mode: Provider;
  step: ApiStep;
  data: unknown;
  fallback?: boolean;
  message?: string;
}

export interface NavStep {
  key: "start" | "standard" | "goals" | "evidence" | "tasks" | "quality";
  name: string;
  desc: string;
  apiStep: ApiStep;
  intro: string;
}

export const EMPTY_INPUT: DesignInput = {
  subject: "",
  grade: "",
  standard: "",
  topic: "",
  duration: "",
  studentBase: "",
  difficulty: "",
};

export const DEMO_INPUT: DesignInput = {
  subject: "小学语文",
  grade: "四年级",
  standard: "能初步把握文章主要内容，体会作品表达的思想感情。",
  topic: "《精卫填海》神话阅读",
  duration: "1课时",
  studentBase: "能读懂故事大意，但容易停留在情节复述，缺少文本证据意识。",
  difficulty: "学生容易只复述故事，不能结合文本证据解释精卫形象。",
};

export const NAV_STEPS: NavStep[] = [
  {
    key: "start",
    name: "设计起点",
    desc: "输入课标与主题",
    apiStep: "start",
    intro: "先把课标、主题和真实学情输入清楚。工作台后续所有生成都围绕这个起点展开。",
  },
  {
    key: "standard",
    name: "课标拆解",
    desc: "能力与表现",
    apiStep: "standard-analysis",
    intro: "把课标翻译成课堂里能看见的能力、表现和风险提醒。",
  },
  {
    key: "goals",
    name: "目标定位",
    desc: "可观察目标",
    apiStep: "goals",
    intro: "把“感受、提升、培养”改写为学生能做出来、说出来、写出来的目标。",
  },
  {
    key: "evidence",
    name: "评价证据",
    desc: "先证据后活动",
    apiStep: "evidence",
    intro: "先设计学生学会的证据，再设计活动，避免课堂热闹但无法证明学习发生。",
  },
  {
    key: "tasks",
    name: "学习任务链",
    desc: "学习动作递进",
    apiStep: "task-chain",
    intro: "用递进任务替代机械环节，让学生经历读懂、找证据、解释、表达。",
  },
  {
    key: "quality",
    name: "支架与质检",
    desc: "支架与体检",
    apiStep: "support-quality",
    intro: "为不同学生准备具体支架，并对整份教学设计做质量体检。",
  },
];
