// Mock data + final-Markdown assembly.
// The step mocks use the《精卫填海》reference lesson (the spec's worked example)
// because the pedagogy is already concrete and observable. The final plan's
// framing sections (课标/学情/难点) use the user's real input so the assembled
// document always reflects what the teacher entered.

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
} from "./types.js";

export const MOCK_UNIT_ANALYSIS_REPORT: UnitAnalysisReport = {
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

export const MOCK_STANDARD: StandardAnalysis = {
  keywords: ["把握主要内容", "体会思想感情", "结合文本证据"],
  coreAbilities: ["概括故事结构", "提取关键证据", "解释人物形象", "理解神话表达"],
  observablePerformances: [
    '学生能借助"起因—经过—结果"概括故事内容。',
    '学生能抓住"衔""堙"等关键词，说明精卫坚持填海的表现。',
    '学生能用"我从……看出……因为……"表达对精卫形象的理解。',
  ],
  riskWarnings: [
    '不要只写"感受精卫精神"，要改成可观察的学生表现。',
    '不要把课堂停留在情节复述，要推进到"证据—解释—表达"。',
  ],
};

export const MOCK_GOALS: Goals = {
  basicGoal: "能借助起因、经过、结果，概括《精卫填海》的主要内容。",
  coreGoal: '能抓住"衔""堙"等关键词句，结合精卫的行为证据说明人物形象。',
  challengeGoal: "能联系其他神话人物，初步理解神话以想象表达精神追求的特点。",
};

export const MOCK_EVIDENCE: Evidence[] = [
  {
    goal: "概括《精卫填海》的主要内容。",
    studentEvidence: "学生能完整说清精卫为什么填海、怎样填海、结果如何。",
    criteria: "内容完整，有顺序，不遗漏关键情节。",
    possibleMisunderstanding: "只说零散情节，不能形成完整故事结构。",
  },
  {
    goal: "结合行为证据说明人物形象。",
    studentEvidence: '学生能引用"衔""堙"等词句，并解释这些行为体现了什么。',
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

export const MOCK_TASKS: TaskItem[] = [
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

export const MOCK_SUPPORT: Support = {
  lowSupport: '为读不顺文本的学生提供"谁—为什么—怎样做—结果如何"故事结构图，并允许先用关键词作答。',
  middleSupport: '为会复述但不会解释的学生提供句式：我从"……"看出精卫……因为……',
  highChallenge: "引导表达能力强的学生比较精卫和夸父，思考神话人物共同的精神追求。",
};

export const MOCK_QUALITY: QualityItem[] = [
  {
    dimension: "课标对齐度",
    status: "通过",
    comment: '目标回应了"把握主要内容"和"体会思想感情"。',
    suggestion: "保留课标拆解与目标对应关系。",
  },
  {
    dimension: "目标清晰度",
    status: "通过",
    comment: "三个目标均指向可观察的学生表现。",
    suggestion: '避免再使用"提升素养"等空泛表达。',
  },
  {
    dimension: "证据充分度",
    status: "通过",
    comment: "每个目标都有对应学生证据和判断标准。",
    suggestion: "课堂中要实际收集学生表达作为证据。",
  },
  {
    dimension: "任务递进度",
    status: "通过",
    comment: "任务从读懂、找证据、解释到迁移表达，递进清楚。",
    suggestion: "控制每个任务时间，避免前松后紧。",
  },
  {
    dimension: "支架具体度",
    status: "需优化",
    comment: "已有三类支架，但可以进一步做成可打印学习单。",
    suggestion: "补充故事结构卡和证据句式卡。",
  },
  {
    dimension: "课堂可实施度",
    status: "通过",
    comment: "任务数量适合一课时，但需要教师掌控交流节奏。",
    suggestion: "全班交流选择2—3个典型证据即可。",
  },
];

/** Returns the mock payload for a generation step. */
export function getMockResult(step: ApiStep, _input: DesignInput): unknown {
  switch (step) {
    case "unit-analysis-report":
      return structuredClone(MOCK_UNIT_ANALYSIS_REPORT);
    case "standard-analysis":
      return structuredClone(MOCK_STANDARD);
    case "goals":
      return structuredClone(MOCK_GOALS);
    case "evidence":
      return structuredClone(MOCK_EVIDENCE);
    case "task-chain":
      return structuredClone(MOCK_TASKS);
    case "support-quality":
      return {
        support: structuredClone(MOCK_SUPPORT),
        quality: structuredClone(MOCK_QUALITY),
      };
    case "final-lesson":
      return { markdown: "" }; // assembled by buildFinalMarkdown in generateLesson
    default:
      return {};
  }
}

/**
 * Assembles a complete Markdown lesson plan from accumulated step outputs.
 * Ported from the single-file prototype so the demo's final document matches
 * exactly. Falls back gracefully on missing sections.
 */
export function buildFinalMarkdown(input: DesignInput, r: Partial<Results>): string {
  const goals = r.goals || ({} as Goals);
  const evidence = r.evidence || [];
  const tasks = r.tasks || [];
  const support = r.support || ({} as Support);
  const quality = r.quality || [];
  const unit = r.unitAnalysisReport;

  const evidenceBlock = evidence.length
    ? evidence
        .map(
          (e, i) =>
            `${i + 1}. 目标：${e.goal}\n   - 学生证据：${e.studentEvidence}\n   - 判断标准：${e.criteria}\n   - 可能误区：${e.possibleMisunderstanding}`,
        )
        .join("\n")
    : "待生成评价证据。";

  const taskBlock = tasks.length
    ? tasks
        .map(
          (t, i) =>
            `${i + 1}. ${t.name}\n   - 教师指令：${t.teacherInstruction}\n   - 学生动作：${t.studentAction}\n   - 课堂产出：${t.classroomOutput}\n   - 对应目标：${t.alignedGoal}`,
        )
        .join("\n")
    : "待生成任务链。";

  const processBlock = tasks.length
    ? tasks
        .map(
          (t) =>
            `### ${t.name}\n教师提出任务："${t.teacherInstruction}"学生通过"${t.studentAction}"完成学习，并形成"${t.classroomOutput}"。`,
        )
        .join("\n\n")
    : "待根据任务链展开。";

  const qualityBlock = quality.length
    ? quality.map((q) => `- ${q.dimension}：${q.status}。${q.comment} 建议：${q.suggestion}`).join("\n")
    : "待生成质量体检。";

  const unitBlock = unit
    ? `## 单元定位型文本解读报告

### 一、单元扫描结果
- 语文要素：${unit.unitScan.chineseElement}
- 单元主题任务：${unit.unitScan.unitThemeTask}
- 编排关系：${unit.unitScan.arrangementLogic}
- 当前课文位置：${unit.unitScan.currentTextPosition}
- 初步判断：${unit.unitScan.initialJudgment}

### 二、当前课文深度解读
- 最值得教：${unit.textDeepReading.mostWorthTeaching}
- 核心教学支撑：${unit.textDeepReading.coreTeachingSupport}
- 唯一核心能力：${unit.textDeepReading.oneCoreAbility}
- 常见误读：${unit.textDeepReading.commonMisreadings.join("；") || "无"}

### 三、儿童起点与理解路径分析
- 进入点：${unit.studentPath.entryPoints}
- 可能障碍：${unit.studentPath.likelyObstacles.join("；") || "无"}
- 适合抵达的感受：${unit.studentPath.suitableFeelings}
- 年级衔接：${unit.studentPath.gradeConnection}

### 四、课堂转化设计
- 一句话课时定位：${unit.classroomTransfer.oneSentenceLessonPosition}
- 唯一核心抓手：${unit.classroomTransfer.coreHandle}
- 递进任务建议：${unit.classroomTransfer.progressiveTasks.join("；") || "无"}
- 学习证据：${unit.classroomTransfer.learningEvidence}

### 五、证据链表
${unit.evidenceChain.map((e) => `- ${e.judgmentType}｜${e.conclusion}｜${e.evidenceSource}：${e.evidenceSummary}`).join("\n")}

### 六、最终结论
${unit.finalConclusion}

`
    : "";

  const topic = input.topic || input.currentTextTitle || "未命名主题";

  return `# ${topic}教学设计

${unitBlock}## 一、课标依据
${input.standard || "待填写课标。"}

## 二、教材与学情分析
学科：${input.subject || "待填写"}；年级：${input.grade || "待填写"}；课时：${input.duration || "待填写"}。

学生基础：${input.studentBase || "待填写。"}

教学难点：${input.difficulty || "待填写。"}

## 三、教学目标
1. ${goals.basicGoal || "待生成基础目标。"}
2. ${goals.coreGoal || "待生成核心目标。"}
3. ${goals.challengeGoal || "待生成挑战目标。"}

## 四、评价证据
${evidenceBlock}

## 五、学习任务链
${taskBlock}

## 六、教学过程
${processBlock}

## 七、学生支架
- 低起点学生：${support.lowSupport || "待生成。"}
- 中间层学生：${support.middleSupport || "待生成。"}
- 高阶学生：${support.highChallenge || "待生成。"}

## 八、板书设计
${topic}
起因 → 经过 → 结果
词句证据 → 人物形象 → 神话精神

## 九、质量体检报告
${qualityBlock}
`;
}
