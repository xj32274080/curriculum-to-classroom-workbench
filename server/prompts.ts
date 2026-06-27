// One prompt builder per generation step. Kept separate (not one giant prompt)
// so each step's instructions, schema and rules are explicit and tunable.
// Every JSON-returning step ends with the same strict "return JSON only" guard.

import type { DesignInput, Results } from "./types.js";

function ctx(input: DesignInput): string {
  return [
    `设计模式：${input.designMode === "unit-positioning" ? "单元定位设计" : "快速设计"}`,
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

function unitPositioningBlock(draft: Partial<Results>): string {
  const u = draft.unitPositioning;
  if (!u) return "";
  return `【单元定位结果】
单元主题：${u.unitTheme}
语文要素：${u.chineseElement}
编排关系：${u.textArrangement}
课后题与语文园地方向：${u.afterClassExerciseFocus}
当前课文功能：${u.currentTextFunction}
核心教学抓手：${u.coreTeachingFocus}
不宜过度展开：${u.notSuitableForExpansion.join("；")}
后续目标建议：${u.targetAdvice}

`;
}

export function buildUnitPositioningPrompt(input: DesignInput): string {
  return `你是小学语文单元定位型文本解读专家。请先扫描整单元材料，判断当前课文在单元中的位置和教学功能，不要直接写教案。

【输入信息】
${ctx(input)}

【输出 JSON 结构】
{
  "unitTheme": "单元人文主题；如果材料不足，写“单元材料不足，只能做基础定位”",
  "chineseElement": "单元语文要素；只能依据材料提取，不能虚构",
  "textArrangement": "本单元课文之间的编排关系",
  "afterClassExerciseFocus": "课后题与语文园地支持的学习方向",
  "currentTextFunction": "当前课文在单元中承担的教学功能",
  "coreTeachingFocus": "本课最值得收束的核心教学抓手",
  "notSuitableForExpansion": ["本课不宜过度展开的内容"],
  "targetAdvice": "后续目标定位建议"
}

【规则】
- 先扫描整单元材料，不直接写教案。
- 提取单元主题、语文要素、课文编排关系、课后题关系。
- 锁定当前课文，判断它在单元中承担什么教学功能。
- 收束到一个核心教学抓手，不要平均展开所有价值。
- 如果 unitMaterial 缺失，明确提示“单元材料不足，只能做基础定位”。
- 不得虚构教材中没有出现的单元导语、课后题或语文园地内容。

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
  const unit = unitPositioningBlock(draft);
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
- 如果有单元定位结果，目标必须回应当前课文在单元中的教学功能、核心教学抓手、课后题与语文要素方向。

${JSON_GUARD}`;
}

export function buildEvidencePrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const goalsBlock = goals
    ? `【已确定的教学目标】\n基础目标：${goals.basicGoal}\n核心目标：${goals.coreGoal}\n挑战目标：${goals.challengeGoal}\n`
    : "";
  const unit = unitPositioningBlock(draft);
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
- 如果有单元定位结果，证据要能证明学生真的抵达了本课的单元功能和核心教学抓手。

${JSON_GUARD}`;
}

export function buildTaskChainPrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const goalsBlock = goals
    ? `【已确定的教学目标】\n基础目标：${goals.basicGoal}\n核心目标：${goals.coreGoal}\n挑战目标：${goals.challengeGoal}\n`
    : "";
  const unit = unitPositioningBlock(draft);
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
- 如果有单元定位结果，任务链要围绕当前课文功能、核心教学抓手、课后题与语文要素方向展开，避免平均铺开。

${JSON_GUARD}`;
}

export function buildSupportQualityPrompt(input: DesignInput, draft: Partial<Results>): string {
  const goals = draft.goals;
  const tasks = draft.tasks;
  const goalsBlock = goals ? `教学目标：基础=${goals.basicGoal}；核心=${goals.coreGoal}；挑战=${goals.challengeGoal}。\n` : "";
  const tasksBlock = tasks ? `任务链：${tasks.map((t) => t.name).join("、")}。\n` : "";
  const unit = unitPositioningBlock(draft);
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
- 如果有单元定位结果，质量体检要检查目标、证据、任务链是否回应当前课文的单元功能和核心教学抓手。

${JSON_GUARD}`;
}

export function buildFinalLessonPrompt(input: DesignInput, draft: Partial<Results>): string {
  return `你是教学设计统稿专家。请基于以下已完成的各步产出，整合并润色为一份完整、可直接用于真实课堂的教学设计。
保持目标、评价、活动三者对齐；补全"教学过程"和"板书设计"，使过程具体不空。
如果有单元定位结果，统稿必须体现当前课文在单元中的教学功能、核心教学抓手、课后题与语文要素方向，并避免展开不宜过度展开的内容。

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
  "unit-positioning": (i: DesignInput, d: Partial<Results>) => buildUnitPositioningPrompt(i),
  "standard-analysis": (i: DesignInput, d: Partial<Results>) => buildStandardAnalysisPrompt(i),
  goals: (i: DesignInput, d: Partial<Results>) => buildGoalsPrompt(i, d),
  evidence: (i: DesignInput, d: Partial<Results>) => buildEvidencePrompt(i, d),
  "task-chain": (i: DesignInput, d: Partial<Results>) => buildTaskChainPrompt(i, d),
  "support-quality": (i: DesignInput, d: Partial<Results>) => buildSupportQualityPrompt(i, d),
  "final-lesson": (i: DesignInput, d: Partial<Results>) => buildFinalLessonPrompt(i, d),
} as const;
