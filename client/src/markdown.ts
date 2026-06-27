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
