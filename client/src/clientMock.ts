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
  UnitAnalysisReport,
} from "./types";

export const CLIENT_MOCK_UNIT_ANALYSIS_REPORT: UnitAnalysisReport = {
  currentText: "精卫填海",
  unitScan: {
    chineseElement: "了解故事起因、经过、结果，感受神话中神奇的想象和鲜明的人物形象。",
    unitThemeTask: "借助一组中外神话，理解神话以奇特想象承载人的精神追求。",
    arrangementLogic:
      "本单元由创世、抗争、奉献、补天等神话组成。《精卫填海》篇幅短小、语言凝练，适合承担从讲清故事走向抓关键词解释形象的中段功能。",
    currentTextPosition: "位于单元内部的文言神话文本，是学生从现代叙事阅读过渡到凭借凝练语句提取证据的关键课文。",
    initialJudgment: "较强判断：本课不宜平均铺开神话背景、文言知识和精神升华，应收束到“用行为词解释人物形象”。",
  },
  textDeepReading: {
    mostWorthTeaching: "最值得教的是“衔”“堙”等动作词如何把精卫持续填海的形象压缩进极短文本。",
    coreTeachingSupport: "当前课文原文中“溺而不返”“常衔西山之木石，以堙于东海”提供了直接文本证据。",
    oneCoreAbility: "抓住关键词句，结合故事结构解释神话人物形象。",
    commonMisreadings: ["只复述精卫填海的故事", "把“坚持不懈”当作空泛口号", "把课堂变成文言字词串讲"],
  },
  studentPath: {
    entryPoints: "学生容易从“为什么填海、怎样填海”进入文本，可先用起因—经过—结果讲清故事。",
    likelyObstacles: ["能说情节但找不到证据", "找到词句但不会解释", "把神话精神讲成成人化大道理"],
    suitableFeelings: "适合抵达“精卫弱小却持续行动”的具体感受，而不是泛泛拔高为宏大精神。",
    gradeConnection: "四年级学生可从复述故事提升到用关键词句支撑判断，为后续阅读人物形象类文本打基础。",
  },
  classroomTransfer: {
    oneSentenceLessonPosition: "这是一节借文言神话训练学生“抓行为词解释人物形象”的课。",
    coreHandle: "围绕“衔”“堙”“常”建立动作证据链。",
    entrySuggestion: "先让学生讲清故事，再追问“你从哪个词看出精卫一直在做这件事”。",
    progressiveTasks: ["讲清精卫填海的起因、经过、结果", "圈出最能表现精卫行为的关键词", "用词句证据解释精卫形象", "用一句话说明这个神话最打动自己的地方"],
    learningEvidence: "学生能用“我从……看出……因为……”说清一个有文本证据的人物判断。",
    teachingWarnings: ["不要平均拓展其他神话", "不要过度讲解文言知识", "不要脱离词句直接喊精神口号"],
  },
  evidenceChain: [
    {
      conclusion: "本课核心抓手应落在行为词证据上。",
      evidenceSource: "当前课文原文",
      evidenceSummary: "“常衔西山之木石，以堙于东海”集中呈现精卫持续行动。",
      judgmentType: "明确判断",
    },
    {
      conclusion: "本课承担从故事复述走向形象解释的功能。",
      evidenceSource: "单元语文要素与课后题方向",
      evidenceSummary: "材料指向讲清故事、交流人物印象和体会神话想象。",
      judgmentType: "较强判断",
    },
    {
      conclusion: "其他课文只宜作为定位参照，不宜展开比较教学。",
      evidenceSource: "单元课文目录",
      evidenceSummary: "目录能显示神话群文关系，但未提供足够课后题细节支持展开比较。",
      judgmentType: "谨慎判断",
    },
  ],
  finalConclusion:
    "《精卫填海》的课时定位应从“讲清故事”收束到“抓行为词解释人物形象”。后续教学目标、评价证据和任务链都应围绕这一唯一核心抓手展开。",
};
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
    case "unit-analysis-report":
      return CLIENT_MOCK_UNIT_ANALYSIS_REPORT;
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
