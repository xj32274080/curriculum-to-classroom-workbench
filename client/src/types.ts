// Client-side domain types (mirrors server/types.ts). Kept duplicated so the
// client package has zero dependency on the server.

export type ApiStep =
  | "start"
  | "unit-analysis-report"
  | "standard-analysis"
  | "goals"
  | "evidence"
  | "task-chain"
  | "support-quality"
  | "final-lesson";

export type Provider = "mock" | "openai" | "anthropic" | "dify";
export type DesignMode = "quick" | "unit-analysis";

export interface DesignInput {
  designMode: DesignMode;
  subject: string;
  grade: string;
  standard: string;
  topic: string;
  duration: string;
  studentBase: string;
  difficulty: string;
  unitMaterial: string;
  currentTextTitle: string;
  textbook: string;
  textContent: string;
}

export interface UnitAnalysisReport {
  currentText: string;
  unitScan: {
    chineseElement: string;
    unitThemeTask: string;
    arrangementLogic: string;
    currentTextPosition: string;
    initialJudgment: string;
  };
  textDeepReading: {
    mostWorthTeaching: string;
    coreTeachingSupport: string;
    oneCoreAbility: string;
    commonMisreadings: string[];
  };
  studentPath: {
    entryPoints: string;
    likelyObstacles: string[];
    suitableFeelings: string;
    gradeConnection: string;
  };
  classroomTransfer: {
    oneSentenceLessonPosition: string;
    coreHandle: string;
    entrySuggestion: string;
    progressiveTasks: string[];
    learningEvidence: string;
    teachingWarnings: string[];
  };
  evidenceChain: Array<{
    conclusion: string;
    evidenceSource: string;
    evidenceSummary: string;
    judgmentType: "明确判断" | "较强判断" | "谨慎判断" | "资料不足";
  }>;
  finalConclusion: string;
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
  unitAnalysisReport?: UnitAnalysisReport;
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
  designMode: "quick",
  subject: "",
  grade: "",
  standard: "",
  topic: "",
  duration: "",
  studentBase: "",
  difficulty: "",
  unitMaterial: "",
  currentTextTitle: "",
  textbook: "",
  textContent: "",
};

export const DEMO_INPUT: DesignInput = {
  designMode: "unit-analysis",
  subject: "小学语文",
  grade: "三年级",
  standard: "了解所描写景物的特点；初步学习整合信息，介绍一种事物。",
  topic: "《暴风雨来临之前》阅读",
  duration: "1课时",
  studentBase: "能朗读并感受写景文章的氛围，能找出文中描写的景物，但容易只看到零散现象，看不出变化的过程与层次。",
  difficulty: "学生能感知“起风了”“打雷了”等变化，但难以区分“凉风”与“大风”、“寂静”与“再次寂静”的层次，难以把多角度描写串成一条完整的变化链。",
  unitMaterial:
    "单元主题：奇妙的世界——发现世界之美，领略大自然的奇妙。\n语文要素：阅读——了解所描写景物的特点；习作——初步学习整合信息，介绍一种事物。\n课文编排：《火烧云》（聚焦变化的结果：颜色与形状的变幻）→《暴风雨来临之前》（转向变化的过程：环境由静到动、由压抑到释放）→《我们奇妙的世界》（从普通事物中发现美）→习作《国宝大熊猫》（迁移观察与整合信息）。\n课后题方向：体会作者是怎样有顺序地写出景物变化的。",
  currentTextTitle: "暴风雨来临之前",
  textbook: "统编版小学语文三年级 写景单元",
  textContent: "（课文片段，据关键句整理）乌云气势汹汹地逼近了，树枝不摇，树叶也不动。一会儿，新鲜的微风像是最初的报信者，凉凉地吹过来，树叶微微抖动。接着，大风跟着来了，吹得鸡毛乱蓬蓬。之后，一切又都沉寂下来。突然，轰隆隆的雷声宣告暴风雨的到来。",
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
