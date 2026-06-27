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
  currentText: "暴风雨来临之前",
  unitScan: {
    chineseElement: "阅读要素：了解所描写景物的特点；习作要素：初步学习整合信息，介绍一种事物。",
    unitThemeTask: "本单元以“奇妙的世界”为主题，引导学生发现世界之美、领略大自然的奇妙，并通过阅读写景文章积累观察与描写景物的方法。",
    arrangementLogic:
      "《火烧云》聚焦“变化的结果”（颜色与形状的变幻）；《暴风雨来临之前》转向“变化的过程”（环境由静到动、由压抑到释放）；《我们奇妙的世界》转向“发现的眼光”（从普通事物中发现美）；习作《国宝大熊猫》迁移运用观察与整合信息的能力。",
    currentTextPosition: "处于单元“方法深化与过渡”的位置：在《火烧云》基础上把“观察变化”从“看到什么”深化为“怎样看变化的过程”，为《我们奇妙的世界》的自主观察提供方法示范。",
    initialJudgment: "较强判断：本课核心任务是学习“有顺序地观察和描写一个动态变化的过程”，应收束到“梳理变化序列”，而非罗列暴风雨景象或进行知识拓展。",
  },
  textDeepReading: {
    mostWorthTeaching: "作者是怎样通过“时间推进”和“对比变化”（静—动—静—更剧烈的动；从小到大、从无到有）构建一个充满张力的动态场景。",
    coreTeachingSupport: "文本清晰呈现“压抑—启动—加剧—蓄势—高潮”的变化梯度，并调动视觉（乌云、昏暗的树木）、触觉（沉闷、凉凉的风）、听觉（寂静、轰隆隆的雷声）等多感官捕捉。",
    oneCoreAbility: "梳理并表达动态场景的变化序列。",
    commonMisreadings: ["把课文当成“暴风雨知识说明文”来教，解释闪电、雷声的成因", "过度渲染“紧张、害怕”氛围，窄化文本复杂内隐的情感", "让学生零散找“描写了哪些事物”然后对答案，未建构变化关系"],
  },
  studentPath: {
    entryPoints: "学生几乎都有暴风雨来临前的生活体验（天黑、起风、闷热），可由此自然进入；刚学完《火烧云》，对“观察变化”已有初步印象。",
    likelyObstacles: ["难以发现变化的层次和顺序，把“凉风”“大风”“再次寂静”混在一起，看到的变化是跳跃、模糊的", "难以把多角度描写（动物、风）与“变化”核心联系起来", "容易陷入对单个词（如“气势汹汹”）的过度解读，忽略其在变化链中的位置"],
    suitableFeelings: "可引导生成变化的节奏感、场景的层次感和“等待”的张力感；不宜强加“对大自然的敬畏”“恐惧”等成人化、抽象情感。",
    gradeConnection: "相比低年段从“了解大意”提升为“探究表达方法”；相比四五年级暂不系统分析“详略得当”“情景交融”，重点放在清晰感知与梳理“变化的过程”。",
  },
  classroomTransfer: {
    oneSentenceLessonPosition: "带学生学会：按照事情发展的顺序，理清暴风雨来临前环境的变化过程。",
    coreHandle: "绘制“变化地图”——圈画关键景物和表示变化的词语，共建“起风前→凉风→大风→再次寂静→雷声”的变化流程图。",
    entrySuggestion: "从“新鲜的微风像是最初的报信者”切入：“报信者”揭示变化本质，可向后追问（大风来了怎样）、向前追溯（报信者来之前是什么样），勾连整条变化链。",
    progressiveTasks: ["找到“变化”的信号：默读找描写“风”的段落，说清风怎样变化（凉风→大风）", "绘制“变化地图”：小组在时间轴上补充各阶段天空、大地、动物、人感受的变化，全班共建", "借助地图讲述变化：用“先…接着…然后…最后…”有序讲变化过程，并品析“再次寂静”的蓄势之妙"],
    learningEvidence: "能圈画各阶段关键景物；能给“凉风、大风、雷声、再次寂静、起风前”正确排序；能借助地图有序复述；能解释“一切又都沉寂下来”是为引出更大变化。",
    teachingWarnings: ["避免提问碎片化（“乌云什么样？”），应多问对比与关系（“和之前有什么不同？作者为什么这样写？”）", "避免花过多时间讨论“暴风雨”本身（可放课后选做），冲淡对表达方法的聚焦", "避免把“变化地图”变成教师板书展示，地图须由学生在任务中生成"],
  },
  evidenceChain: [
    {
      conclusion: "本课核心是教“变化的过程”而非“暴风雨的景象”。",
      evidenceSource: "课文标题 + 单元语文要素",
      evidenceSummary: "标题限定“来临之前”；单元要求“了解景物特点”，本文最突出的特点即变化过程。",
      judgmentType: "明确判断",
    },
    {
      conclusion: "本课在单元中起“方法深化”作用。",
      evidenceSource: "单元内部编排逻辑",
      evidenceSummary: "前有《火烧云》感知“变化结果”，后有《我们奇妙的世界》要求“发现美”，本文聚焦“变化过程”是关键过渡。",
      judgmentType: "较强判断",
    },
    {
      conclusion: "文本核心支点是“变化梯度”和“多感官描写”。",
      evidenceSource: "当前课文原文",
      evidenceSummary: "文本清晰呈现“压抑—启动—加剧—蓄势—高潮”梯度，调动视觉、触觉、听觉等多种感官。",
      judgmentType: "明确判断",
    },
    {
      conclusion: "学生最可能卡在“看不出变化层次”。",
      evidenceSource: "三年级学情 + 文本特点",
      evidenceSummary: "学生能感知“变化了”，但难区分“凉风”与“大风”、“寂静”与“再次寂静”的层次差别。",
      judgmentType: "较强判断",
    },
    {
      conclusion: "核心抓手应为“梳理变化序列”。",
      evidenceSource: "单元要素 + 文本核心",
      evidenceSummary: "梳理变化序列能最直接有效地把“了解景物特点”转化为可操作的学习任务。",
      judgmentType: "明确判断",
    },
    {
      conclusion: "教学最应避免“碎片化提问”。",
      evidenceSource: "课堂转化设计需要",
      evidenceSummary: "碎片化提问使学生无法建构整体认知，冲淡对“变化过程”核心的理解。",
      judgmentType: "较强判断",
    },
  ],
  finalConclusion:
    "《暴风雨来临之前》是单元内关键的“方法过渡站”：把《火烧云》中“观察变化”的初步感知，深化为“有顺序、有层次地捕捉与表达一个完整变化过程”的具体能力，为后续自主观察与习作铺设台阶。唯一重点是梳理并呈现暴风雨来临前环境变化的完整序列（变化地图）；最该避免的是把课文内容（暴风雨）本身当重点进行知识拓展或情感渲染，而应将全部火力集中在“作者如何一步步写出变化过程”。",
};
export const CLIENT_MOCK_STANDARD: StandardAnalysis = {
  keywords: ["景物特点", "变化过程", "有顺序地描写", "动静对比"],
  coreAbilities: ["梳理变化序列", "圈画关键景物与变化词", "有序复述变化过程", "体会动静对比的表达效果"],
  observablePerformances: [
    "学生能按“起风前—凉风—大风—再次寂静—雷声”的顺序，圈画出各阶段描写的景物。",
    "学生能用“先……接着……然后……最后……”有顺序地复述暴风雨来临前的变化过程。",
    "学生能说出“一切又都沉寂下来”在变化链中的作用（蓄势）。",
  ],
  riskWarnings: [
    "不要把课上成“暴风雨知识科普课”，要聚焦“怎样写出变化”。",
    "不要只让学生零散找景物，要推进到“景物之间怎样构成变化”。",
  ],
};

export const CLIENT_MOCK_GOALS: Goals = {
  basicGoal: "能按时间顺序圈画出暴风雨来临前各阶段（起风前、凉风、大风、再次寂静、雷声）描写的景物。",
  coreGoal: "能借助“变化地图”，用“先……接着……然后……最后……”有顺序地复述暴风雨来临前的变化过程。",
  challengeGoal: "能发现并说出作者用“动静对比”（如“再次寂静”后再写雷声）营造紧张感的好处。",
};

export const CLIENT_MOCK_EVIDENCE: Evidence[] = [
  {
    goal: "按顺序圈画各阶段景物。",
    studentEvidence: "学生在课文上准确圈出五个阶段对应的关键景物与表示变化的词。",
    criteria: "阶段划分清楚，景物与阶段对应正确，不遗漏。",
    possibleMisunderstanding: "只圈零散景物，不按变化阶段归类。",
  },
  {
    goal: "有序复述变化过程。",
    studentEvidence: "学生借助“变化地图”，用表示顺序的词连贯讲清变化。",
    criteria: "顺序正确，过渡自然，能说出各阶段不同。",
    possibleMisunderstanding: "跳跃地讲，把“凉风”和“大风”混在一起。",
  },
  {
    goal: "体会动静对比的好处。",
    studentEvidence: "学生能说出“一切又都沉寂下来”是为引出更大变化（蓄势）。",
    criteria: "能结合文本说清理由，不是套话。",
    possibleMisunderstanding: "只说“很安静”，说不清这样写的作用。",
  },
];

export const CLIENT_MOCK_TASKS: TaskItem[] = [
  {
    name: "任务一：找变化信号",
    teacherInstruction: "默读课文，圈出描写“风”的词句，说一说风是怎样变化的。",
    studentAction: "圈画“凉风”“大风”等关键词，标注变化。",
    classroomOutput: "完成“风的变化”标注。",
    alignedGoal: "基础目标",
  },
  {
    name: "任务二：画变化地图",
    teacherInstruction: "小组合作，在时间轴上把每个阶段的天空、大地、动物和人的感受填进去，共建“变化地图”。",
    studentAction: "按阶段梳理景物，合作完成时间轴。",
    classroomOutput: "形成一张“暴风雨来临前变化地图”。",
    alignedGoal: "核心目标",
  },
  {
    name: "任务三：讲变化过程",
    teacherInstruction: "看着“变化地图”，用“先……接着……然后……最后……”讲讲暴风雨来临前的景象怎样一步步变化。",
    studentAction: "借助句式有序复述变化过程。",
    classroomOutput: "完成一次有序的口头复述。",
    alignedGoal: "核心目标",
  },
  {
    name: "任务四：品蓄势之妙",
    teacherInstruction: "讨论：作者为什么先写“一切又都沉寂下来”，再写“轰隆隆的雷声”？这样写有什么好处？",
    studentAction: "对比朗读，发现动静对比，说明好处。",
    classroomOutput: "说出“以静衬动”的一点感受。",
    alignedGoal: "挑战目标",
  },
];

export const CLIENT_MOCK_SUPPORT: Support = {
  lowSupport: "为看不出变化层次的学生提供已标好阶段的“变化地图”框架，允许先用关键词填空。",
  middleSupport: "为会找景物但不会连贯讲的学生提供句式：“起风前……，接着凉风来了……，然后大风……，最后……。”",
  highChallenge: "引导表达能力强的学生比较“凉风”与“大风”两段写法的不同，体会从小到大、从轻到猛的层次。",
};

export const CLIENT_MOCK_QUALITY: QualityItem[] = [
  { dimension: "课标对齐度", status: "通过", comment: "目标回应了“了解所描写景物的特点”，聚焦“变化的过程”。", suggestion: "保留课标拆解与目标的对应关系。" },
  { dimension: "目标清晰度", status: "通过", comment: "三个目标均指向可观察的学生表现（圈画、复述、解释）。", suggestion: "避免使用“感受大自然之美”等空泛表达。" },
  { dimension: "证据充分度", status: "通过", comment: "每个目标都有对应的学生证据和判断标准。", suggestion: "课堂中要实际收集学生的“变化地图”和复述作为证据。" },
  { dimension: "任务递进度", status: "通过", comment: "任务从找信号、画地图、讲过程到品写法，递进清楚。", suggestion: "控制每个任务时间，“画地图”环节留足合作时间。" },
  { dimension: "支架具体度", status: "需优化", comment: "已有三类支架，可进一步做成可打印的“变化地图”学习单。", suggestion: "补充分阶段时间轴和复述句式卡。" },
  { dimension: "课堂可实施度", status: "通过", comment: "任务数量适合一课时，但需要教师掌控交流节奏。", suggestion: "全班交流选择2—3张典型“变化地图”即可。" },
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
