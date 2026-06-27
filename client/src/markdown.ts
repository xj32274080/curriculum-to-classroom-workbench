// Assembles the final Markdown lesson plan from accumulated step results.
// Used by the live preview (always reflects current state) and by the
// client-side network-failure fallback. Mirrors server/mockData.buildFinalMarkdown.

import type { DesignInput, Goals, Results, Support } from "./types";

export function buildFinalMarkdown(input: DesignInput, r: Partial<Results>): string {
  const goals = r.goals || ({} as Goals);
  const evidence = r.evidence || [];
  const tasks = r.tasks || [];
  const support = r.support || ({} as Support);
  const quality = r.quality || [];
  const unit = r.unitPositioning;

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
    ? `## 单元定位
- 单元主题：${unit.unitTheme}
- 语文要素：${unit.chineseElement}
- 编排关系：${unit.textArrangement}
- 当前课文功能：${unit.currentTextFunction}
- 核心教学抓手：${unit.coreTeachingFocus}
- 不宜过度展开：${unit.notSuitableForExpansion.join("；") || "无"}

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
