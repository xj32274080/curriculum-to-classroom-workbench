// CLIENT-SIDE SAFETY NET (last resort only).
//
// The single source of truth for mock data is the BACKEND (server/mockData.ts).
// These constants exist ONLY so the UI can keep rendering a complete demo even
// if the backend process is unreachable (e.g. killed during a live demo). The
// normal path always goes through /api/generate; this is used solely in the
// network-failure branch of App.handleGenerate.

import { buildFinalMarkdown } from "./markdown";
import type {
  ApiStep,
  DesignInput,
  Evidence,
  Goals,
  QualityItem,
  Results,
  StandardAnalysis,
  Support,
  TaskItem,
} from "./types";

export const CLIENT_MOCK_STANDARD: StandardAnalysis = {
  keywords: ["把握主要内容", "体会思想感情", "结合文本证据"],
  coreAbilities: ["概括故事结构", "提取关键证据", "解释人物形象", "理解神话表达"],
  observablePerformances: [
    '学生能借助"起因—经过—结果"概括故事内容。',
    '学生能抓住"衔""堟"等关键词，说明精卫坚持填海的表现。',
    '学生能用"我从……看出……因为……"表达对精卫形象的理解。',
  ],
  riskWarnings: [
    '不要只写"感受精卫精神"，要改成可观察的学生表现。',
    '不要把课堂停留在情节复述，要推进到"证据—解释—表达"。',
  ],
};

export const CLIENT_MOCK_GOALS: Goals = {
  basicGoal: "能借助起因、经过、结果，概括《精卫填海》的主要内容。",
  coreGoal: '能抓住"衔""堟"等关键词句，结合精卫的行为证据说明人物形象。',
  challengeGoal: "能联系其他神话人物，初步理解神话以想象表达精神追求的特点。",
};

export const CLIENT_MOCK_EVIDENCE: Evidence[] = [
  {
    goal: "概括《精卫填海》的主要内容。",
    studentEvidence: "学生能完整说清精卫为什么填海、怎样填海、结果如何。",
    criteria: "内容完整，有顺序，不遗漏关键情节。",
    possibleMisunderstanding: "只说零散情节，不能形成完整故事结构。",
  },
  {
    goal: "结合行为证据说明人物形象。",
    studentEvidence: '学生能引用"衔""堟"等词句，并解释这些行为体现了什么。',
    criteria: '有文本依据，有解释，不只喊"坚持不懈"。',
    possibleMisunderstanding: "找到词句但不会解释，只停留在抄原文。",
  },
  {
    goal: "理解神话以想象表达精神追求。",
    studentEvidence: "学生能把精卫与夸父、女娲等神话人物进行简单联系。",
    criteria: "能说出共同点，表达不空泛。",
    possibleMisunderstanding: "把神话理解成现实故事，忽略想象与精神表达。",
  },
];

export const CLIENT_MOCK_TASKS: TaskItem[] = [
  {
    name: "任务一：读懂故事",
    teacherInstruction: "请默读课文，圈出精卫填海的起因、经过、结果。",
    studentAction: "圈画关键词，整理故事结构。",
    classroomOutput: "完成故事结构卡。",
    alignedGoal: "基础目标",
  },
  {
    name: "任务二：寻找证据",
    teacherInstruction: "请找出最能看出精卫坚持填海的词句，并做标注。",
    studentAction: "标出关键词句，说明选择理由。",
    classroomOutput: '形成"词句—理由"证据卡。',
    alignedGoal: "核心目标",
  },
  {
    name: "任务三：解释形象",
    teacherInstruction: '请用"我从……看出……因为……"说一说你读到的精卫。',
    studentAction: "借助句式，把证据转化为解释。",
    classroomOutput: "完成一次有证据的口头表达。",
    alignedGoal: "核心目标",
  },
  {
    name: "任务四：整合表达",
    teacherInstruction: '请联系你读过的一个神话人物，写一句"我读到的精卫"。',
    studentAction: "比较人物，整合理解，完成短表达。",
    classroomOutput: "写下个人理解句。",
    alignedGoal: "挑战目标",
  },
];

export const CLIENT_MOCK_SUPPORT: Support = {
  lowSupport: '为读不顺文本的学生提供"谁—为什么—怎样做—结果如何"故事结构图，并允许先用关键词作答。',
  middleSupport: '为会复述但不会解释的学生提供句式：我从"……"看出精卫……因为……',
  highChallenge: "引导表达能力强的学生比较精卫和夸父，思考神话人物共同的精神追求。",
};

export const CLIENT_MOCK_QUALITY: QualityItem[] = [
  { dimension: "课标对齐度", status: "通过", comment: '目标回应了"把握主要内容"和"体会思想感情"。', suggestion: "保留课标拆解与目标对应关系。" },
  { dimension: "目标清晰度", status: "通过", comment: "三个目标均指向可观察的学生表现。", suggestion: '避免再使用"提升素养"等空泛表达。' },
  { dimension: "证据充分度", status: "通过", comment: "每个目标都有对应学生证据和判断标准。", suggestion: "课堂中要实际收集学生表达作为证据。" },
  { dimension: "任务递进度", status: "通过", comment: "任务从读懂、找证据、解释到迁移表达，递进清楚。", suggestion: "控制每个任务时间，避免前松后紧。" },
  { dimension: "支架具体度", status: "需优化", comment: "已有三类支架，但可以进一步做成可打印学习单。", suggestion: "补充故事结构卡和证据句式卡。" },
  { dimension: "课堂可实施度", status: "通过", comment: "任务数量适合一课时，但需要教师掌控交流节奏。", suggestion: "全班交流选择2—3个典型证据即可。" },
];

/** Returns the same-shaped mock payload the backend would, for offline fallback. */
export function clientMockForStep(step: ApiStep, input: DesignInput, draft: Partial<Results>): unknown {
  switch (step) {
    case "standard-analysis":
      return CLIENT_MOCK_STANDARD;
    case "goals":
      return CLIENT_MOCK_GOALS;
    case "evidence":
      return CLIENT_MOCK_EVIDENCE;
    case "task-chain":
      return CLIENT_MOCK_TASKS;
    case "support-quality":
      return { support: CLIENT_MOCK_SUPPORT, quality: CLIENT_MOCK_QUALITY };
    case "final-lesson":
      return { markdown: buildFinalMarkdown(input, draft) };
    default:
      return {};
  }
}
