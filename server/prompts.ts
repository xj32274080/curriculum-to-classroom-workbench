// One prompt builder per generation step. Kept separate (not one giant prompt)
// so each step's instructions, schema and rules are explicit and tunable.
// Every JSON-returning step ends with the same strict "return JSON only" guard.

import type { DesignInput, Results } from "./types.js";

function ctx(input: DesignInput): string {
  return [
    `设计模式：${input.designMode === "unit-analysis" ? "单元精准设计" : "快速设计"}`,
    `学科：${input.subject || "未填写"}`,
    `年级：${input.grade || "未填写"}`,
    `课时：${input.duration || "未填写"}`,
    `教学主题：${input.topic || "未填写"}`,
    `当前课文：${input.currentTextTitle || input.topic || "未填写"}`,
    `教材版本 / 单元信息：${input.textbook || "未填写"}`,
    `课标原文：${input.standard || "未填写"}`,
    `学生基础：${input.studentBase || "未填写"}`,
    `教学难点：${input.difficulty || "未填写"}`,
    `整单元材料：${input.unitMaterial || "未提供"}`,
    `课文原文或教材片段：${input.textContent || "未提供"}`,
  ].join("\n");
}

const JSON_GUARD =
  '严格要求：只返回一个合法 JSON 对象，不要输出任何解释文字、不要使用 Markdown 代码块、不要在 JSON 前后添加说明。所有内容用中文。';

function unitAnalysisReportBlock(draft: Partial<Results>): string {
  const r = draft.unitAnalysisReport;
  if (!r) return "";
  return `【单元定位型文本解读报告 3.0】
当前课文：${r.currentText}
一、单元扫描结果
语文要素：${r.unitScan.chineseElement}
单元主题任务：${r.unitScan.unitThemeTask}
编排逻辑：${r.unitScan.arrangementLogic}
当前课文位置：${r.unitScan.currentTextPosition}
初步判断：${r.unitScan.initialJudgment}

二、当前课文深度解读
最值得教：${r.textDeepReading.mostWorthTeaching}
核心教学支撑：${r.textDeepReading.coreTeachingSupport}
唯一核心能力：${r.textDeepReading.oneCoreAbility}
常见误读：${r.textDeepReading.commonMisreadings.join("；")}

三、儿童起点与理解路径分析
进入点：${r.studentPath.entryPoints}
可能障碍：${r.studentPath.likelyObstacles.join("；")}
适合抵达的感受：${r.studentPath.suitableFeelings}
年级衔接：${r.studentPath.gradeConnection}

四、课堂转化设计
一句话课时定位：${r.classroomTransfer.oneSentenceLessonPosition}
唯一核心抓手：${r.classroomTransfer.coreHandle}
进入建议：${r.classroomTransfer.entrySuggestion}
递进任务建议：${r.classroomTransfer.progressiveTasks.join("；")}
学习证据：${r.classroomTransfer.learningEvidence}
教学提醒：${r.classroomTransfer.teachingWarnings.join("；")}

五、证据链表
${r.evidenceChain.map((e) => `${e.judgmentType}｜${e.conclusion}｜${e.evidenceSource}：${e.evidenceSummary}`).join("\n")}

六、最终结论
${r.finalConclusion}

`;
}

export function buildUnitAnalysisReportPrompt(input: DesignInput): string {
  return `你正在使用《小学语文单元定位型文本解读提示词 3.0》。你的任务不是直接生成教案，而是先通过整单元材料建立教材坐标，再锁定当前课文，最后压缩成课时定位、唯一核心抓手、递进任务和学习证据。

【输入信息】
${ctx(input)}

【核心原则】
1. 单元材料用于定位，当前课文用于细读。必须利用整单元材料建立背景坐标；但只有当前课文可以被逐段、逐句、逐结构细读；其他课文只能作为定位参照，不得平均展开。
2. 优先分析“编排后的教材功能”，不是追逐“作者原意”。优先回答：教材为什么把它放在这里；单元为什么需要它；学生通过它要形成什么学习进展。
3. 所有重要判断必须绑定证据。证据来源可以包括：单元导语、语文要素、当前课文原文、课后习题、语文园地、单元内部前后课关系。若证据不足，必须写“资料不足，不作断言”或“谨慎判断”，不得把推测写成事实。
4. 默认以真实课堂为落点。默认场景：1课时、50人大班、普通小学语文课堂。不追求满、全、炫，而追求聚焦、清晰、可教、可学、可评。
5. 最终只能收束为一个核心抓手。不允许并列多个核心目标，不允许面面俱到，不允许把内容理解、表达方法、情感体会、写作迁移、价值引导全部铺开。

【边界提醒】
- 如果没有整单元材料，不能生成标准报告，应在关键字段中说明“单元材料不足，无法完成标准的单元定位型分析”，并在 evidenceChain 中标注“资料不足”。
- 如果没有当前课文原文，可以做单元定位，但不得逐句细读当前课文，必须在 textDeepReading 和 evidenceChain 中标注“资料不足”或“谨慎判断”。
- 不得虚构教材中没有出现的单元导语、课后题或语文园地内容。

【输出 JSON 结构】
{
  "currentText": "当前课文",
  "unitScan": {
    "chineseElement": "单元语文要素；证据不足时写资料不足",
    "unitThemeTask": "单元人文主题或学习任务",
    "arrangementLogic": "本单元课文之间的编排关系，只能依据材料判断",
    "currentTextPosition": "当前课文在单元中的位置",
    "initialJudgment": "对当前课文教材功能的初步判断"
  },
  "textDeepReading": {
    "mostWorthTeaching": "当前课文最值得教的地方，只能收束为一个",
    "coreTeachingSupport": "支撑核心抓手的文本依据；无原文时说明资料不足",
    "oneCoreAbility": "本课唯一核心能力",
    "commonMisreadings": ["儿童或教师容易出现的误读"]
  },
  "studentPath": {
    "entryPoints": "学生进入文本的自然入口",
    "likelyObstacles": ["可能理解障碍"],
    "suitableFeelings": "这个年段适合抵达的真实感受",
    "gradeConnection": "与年段能力发展的衔接"
  },
  "classroomTransfer": {
    "oneSentenceLessonPosition": "一句话课时定位",
    "coreHandle": "本课唯一核心抓手",
    "entrySuggestion": "课堂进入建议",
    "progressiveTasks": ["递进任务建议"],
    "learningEvidence": "学习达成的可见证据",
    "teachingWarnings": ["教学提醒"]
  },
  "evidenceChain": [
    {
      "conclusion": "判断结论",
      "evidenceSource": "证据来源：单元导语/语文要素/当前课文原文/课后习题/语文园地/前后课关系/资料不足",
      "evidenceSummary": "证据摘要",
      "judgmentType": "明确判断|较强判断|谨慎判断|资料不足"
    }
  ],
  "finalConclusion": "最终结论：课时定位、唯一核心抓手、任务方向和学习证据"
}

${JSON_GUARD}`;
}

export function buildStandardAnalysisPrompt(input: DesignInput): string {
  return `你是资深教研员，正在帮一位教师做"课标拆解"。
请把课标原文翻译成课堂里真正能看见的学习行为，而不是贴在教案开头的口号。

【输入信息】
${ctx(input)}

【输出 JSON 结构】
{
  "keywords": ["从课标中提炼的关键词，2-4 个"],
  "coreAbilities": ["这些关键词指向的学生核心能力，3-5 个"],
  "observablePerformances": ["学生在本课能做出来、说出来、写出来的可观察表现，2-4 条，必须可观察"],
  "riskWarnings": ["容易写空、写假的地方及改写提醒，1-3 条"]
}

【规则】
- observablePerformances 必须可观察，禁止出现"感受、体会、激发、培养"等无法观察的空泛词。
- riskWarnings 要具体到怎么改写，例如把"感受精卫精神"改为"能结合行为证据说明人物形象"。

${JSON_GUARD}`;
}

export function buildGoalsPrompt(input: DesignInput, draft: Partial<Results>): string {
  const sa = draft.standard
    ? `【已完成的课标拆解】\n核心能力：${draft.standard.coreAbilities.join("、")}\n可观察表现：${draft.standard.observablePerformances.join("；")}\n`
    : "";
  const unit = unitAnalysisReportBlock(draft);
  return `你是资深教研员，正在帮教师做"目标定位"。请写出基础目标、核心目标、挑战目标三类，全部可观察。

${unit}${sa}【输入信息】
${ctx(input)}

【输出 JSON 结构】
{
  "basicGoal": "基础目标：多数学生本课应达到的可观察目标",
  "coreGoal": "核心目标：本课最要突破、最体现课标核心能力的可观察目标",
  "challengeGoal": "挑战目标：学有余力学生可迁移、可拓展的可观察目标"
}

【规则】
- 三个目标都要能被课堂证据验证，写清"学生能做什么"。
- 严禁"提升语文素养""激发学习兴趣""感受人物精神"等空泛表达。
- 目标要呼应前面拆解出的核心能力。
- 如果有单元定位型文本解读报告，目标必须回应：当前课文在单元中的位置、本课唯一核心抓手、儿童理解障碍、证据链中的判断性质、课堂转化设计中的递进任务建议。

${JSON_GUARD}`;
}

export function buildEvidencePrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const goalsBlock = goals
    ? `【已确定的教学目标】\n基础目标：${goals.basicGoal}\n核心目标：${goals.coreGoal}\n挑战目标：${goals.challengeGoal}\n`
    : "";
  const unit = unitAnalysisReportBlock(draft);
  return `你是评价设计专家，正在帮教师做"评价证据"。核心理念：先设计证据，再设计活动——不是先想活动热不热闹，而是先想怎么证明学生真的学会了。

${unit}${goalsBlock}【输入信息】
${ctx(input)}

【输出 JSON 结构】（一个数组，为前面每个教学目标各生成一条证据）
[
  {
    "goal": "对应的教学目标（可与上方目标一致）",
    "studentEvidence": "学生学会后会呈现的具体可见证据",
    "criteria": "判断该证据是否达成的标准",
    "possibleMisunderstanding": "学生常见的、看似学会其实没学会的误区"
  }
]

【规则】
- studentEvidence 必须具体、可观察，不能写"课堂参与积极"。
- criteria 要能据此打分或判断，不模糊。
- 每条都要对应一个已确定的目标。
- 如果有单元定位型文本解读报告，评价证据必须回应：当前课文在单元中的位置、本课唯一核心抓手、儿童理解障碍、证据链中的判断性质、课堂转化设计中的学习证据。

${JSON_GUARD}`;
}

export function buildTaskChainPrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const goalsBlock = goals
    ? `【已确定的教学目标】\n基础目标：${goals.basicGoal}\n核心目标：${goals.coreGoal}\n挑战目标：${goals.challengeGoal}\n`
    : "";
  const unit = unitAnalysisReportBlock(draft);
  return `你是学习活动设计专家，正在帮教师设计"学习任务链"。请生成 4 个递进任务，突出学生动作，而非教师环节。

${unit}${goalsBlock}【输入信息】
${ctx(input)}

【输出 JSON 结构】（数组，恰好 4 个任务，建议递进为：读懂故事 → 寻找证据 → 解释形象 → 整合表达）
[
  {
    "name": "任务一：…",
    "teacherInstruction": "教师给学生的清晰指令",
    "studentAction": "学生要做的具体学习动作",
    "classroomOutput": "学生完成后的可见课堂产出",
    "alignedGoal": "对应的目标层次：基础目标 / 核心目标 / 挑战目标"
  }
]

【规则】
- 禁止使用"导入—新授—练习—总结"的传统四段式套话。
- 每个任务必须写清学生动作（studentAction）和可见产出（classroomOutput）。
- 任务之间要有认知递进，而不是并列重复。
- 如果有单元定位型文本解读报告，任务链必须回应：当前课文在单元中的位置、本课唯一核心抓手、儿童理解障碍、证据链中的判断性质、课堂转化设计中的递进任务建议。

${JSON_GUARD}`;
}

export function buildSupportQualityPrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const tasks = draft.tasks;
  const goalsBlock = goals ? `教学目标：基础=${goals.basicGoal}；核心=${goals.coreGoal}；挑战=${goals.challengeGoal}。\n` : "";
  const tasksBlock = tasks ? `任务链：${tasks.map((t) => t.name).join("、")}。\n` : "";
  const unit = unitAnalysisReportBlock(draft);
  return `你是教学设计与课堂落地的质检专家。请同时产出"学生支架"与"质量体检"两部分。

${unit}${goalsBlock}${tasksBlock}【输入信息】
${ctx(input)}

【输出 JSON 结构】
{
  "support": {
    "lowSupport": "为读不顺/进不去文本的学生提供的具体支架",
    "middleSupport": "为会复述但不会解释/迁移的学生提供的具体支架",
    "highChallenge": "为表达能力强、学有余力的学生提供的挑战任务"
  },
  "quality": [
    { "dimension": "课标对齐度", "status": "通过|需优化|风险", "comment": "说明", "suggestion": "保留或修改建议" },
    { "dimension": "目标清晰度", "status": "...", "comment": "...", "suggestion": "..." },
    { "dimension": "证据充分度", "status": "...", "comment": "...", "suggestion": "..." },
    { "dimension": "任务递进度", "status": "...", "comment": "...", "suggestion": "..." },
    { "dimension": "支架具体度", "status": "...", "comment": "...", "suggestion": "..." },
    { "dimension": "课堂可实施度", "status": "...", "comment": "...", "suggestion": "..." }
  ]
}

【规则】
- 支架要具体可用（句式、结构图、学习单），不要空话。
- quality 必须覆盖上面这 6 个维度，status 用"通过/需优化/风险"，且至少有一个维度给出可操作的修改建议。
- 如果前面目标里出现了"感受、提升、培养"等空泛表达，要在"目标清晰度"中标为"需优化"并给出改写建议。
- 如果有单元定位型文本解读报告，质量体检要检查目标、证据、任务链是否回应当前课文位置、唯一核心抓手、儿童理解障碍、证据链判断性质和递进任务建议。

${JSON_GUARD}`;
}

export function buildFinalLessonPrompt(input: DesignInput, draft: Partial<Results>): string {
  return `你是教学设计统稿专家。请基于以下已完成的各步产出，整合并润色为一份完整、可直接用于真实课堂的教学设计。
保持目标、评价、活动三者对齐；补全"教学过程"和"板书设计"，使过程具体不空。
如果有单元定位型文本解读报告，统稿必须体现当前课文在单元中的位置、本课唯一核心抓手、儿童理解障碍、证据链判断性质、课堂转化设计中的递进任务建议，并避免面面俱到。

【输入信息】
${ctx(input)}

【已完成的各步产出（JSON）】
${JSON.stringify(draft, null, 2)}

【输出要求】
返回一份 Markdown 教学设计，结构严格为：
# 《主题》教学设计
## 一、课标依据
## 二、教材与学情分析
## 三、教学目标
## 四、评价证据（用表格或清晰列表）
## 五、学习任务链（用表格或清晰列表）
## 六、教学过程（根据任务链展开，不要空）
## 七、学生支架
## 八、板书设计
## 九、质量体检报告（列出六项体检结果与建议）

只返回 Markdown 正文，不要在前后添加额外说明。`;
}

export const PROMPT_BUILDERS = {
  "unit-analysis-report": (i: DesignInput, d: Partial<Results>) => buildUnitAnalysisReportPrompt(i),
  "standard-analysis": (i: DesignInput, d: Partial<Results>) => buildStandardAnalysisPrompt(i),
  goals: (i: DesignInput, d: Partial<Results>) => buildGoalsPrompt(i, d),
  evidence: (i: DesignInput, d: Partial<Results>) => buildEvidencePrompt(i, d),
  "task-chain": (i: DesignInput, d: Partial<Results>) => buildTaskChainPrompt(i, d),
  "support-quality": (i: DesignInput, d: Partial<Results>) => buildSupportQualityPrompt(i, d),
  "final-lesson": (i: DesignInput, d: Partial<Results>) => buildFinalLessonPrompt(i, d),
} as const;
