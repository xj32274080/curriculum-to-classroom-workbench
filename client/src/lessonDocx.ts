// Builds a formatted .docx from the already-generated structured results
// (no new AI call). Throws on failure so the caller can show the fallback toast.

import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { DesignInput, Results } from "./types";
import { downloadBlob, extractTopicName } from "./utils";

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

type ParaOpts = { bold?: boolean; size?: number; after?: number; before?: number; color?: string };

function p(text: string, opts: ParaOpts = {}): Paragraph {
  return new Paragraph({
    spacing: { after: opts.after ?? 80, before: opts.before ?? 0 },
    children: [new TextRun({ text: text || "", bold: opts.bold, size: opts.size ?? 24, color: opts.color })],
  });
}

function center(text: string, opts: ParaOpts = {}): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.after ?? 80, before: opts.before ?? 0 },
    children: [new TextRun({ text: text || "", bold: opts.bold, size: opts.size ?? 24, color: opts.color })],
  });
}

function h1(text: string): Paragraph {
  return p(text, { bold: true, size: 28, before: 260, after: 100 });
}

function cell(text: string, opts: { bold?: boolean; width?: number } = {}): TableCell {
  return new TableCell({
    borders: CELL_BORDERS,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    children: [p(text || "", { bold: opts.bold, size: 22, after: 0 })],
  });
}

function gridTable(header: string[], widths: number[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((t, i) => cell(t, { bold: true, width: widths[i] })),
      }),
      ...rows.map((row) => new TableRow({ children: row.map((c, i) => cell(c, { width: widths[i] })) })),
    ],
  });
}

export async function exportLessonToDocx(input: DesignInput, results: Results): Promise<void> {
  const topic = input.topic || input.currentTextTitle || "未命名主题";
  const topicName = extractTopicName(topic);
  const docTitle = topicName === "教学设计" ? "教学设计" : `《${topicName}》教学设计`;
  const goals = results.goals;
  const evidence = results.evidence || [];
  const tasks = results.tasks || [];
  const support = results.support;
  const quality = results.quality || [];
  const unit = results.unitAnalysisReport;

  const children: Array<Paragraph | Table> = [];

  // 标题（居中）+ 副标题
  children.push(center(docTitle, { bold: true, size: 36, after: 60 }));
  children.push(center('由“课标到课堂｜AI教学设计工作台”生成', { size: 20, color: "888888", after: 220 }));

  if (unit) {
    children.push(h1("单元定位型文本解读报告"));
    children.push(p("一、单元扫描结果", { bold: true }));
    children.push(p(`语文要素：${unit.unitScan.chineseElement}`));
    children.push(p(`单元主题任务：${unit.unitScan.unitThemeTask}`));
    children.push(p(`编排关系：${unit.unitScan.arrangementLogic}`));
    children.push(p(`当前课文位置：${unit.unitScan.currentTextPosition}`));
    children.push(p(`初步判断：${unit.unitScan.initialJudgment}`));
    children.push(p("二、当前课文深度解读", { bold: true }));
    children.push(p(`最值得教：${unit.textDeepReading.mostWorthTeaching}`));
    children.push(p(`核心教学支撑：${unit.textDeepReading.coreTeachingSupport}`));
    children.push(p(`唯一核心能力：${unit.textDeepReading.oneCoreAbility}`));
    children.push(p(`常见误读：${unit.textDeepReading.commonMisreadings.join("；") || "无"}`));
    children.push(p("三、儿童起点与理解路径分析", { bold: true }));
    children.push(p(`进入点：${unit.studentPath.entryPoints}`));
    children.push(p(`可能障碍：${unit.studentPath.likelyObstacles.join("；") || "无"}`));
    children.push(p(`适合抵达的感受：${unit.studentPath.suitableFeelings}`));
    children.push(p(`年级衔接：${unit.studentPath.gradeConnection}`));
    children.push(p("四、课堂转化设计", { bold: true }));
    children.push(p(`一句话课时定位：${unit.classroomTransfer.oneSentenceLessonPosition}`));
    children.push(p(`唯一核心抓手：${unit.classroomTransfer.coreHandle}`));
    children.push(p(`递进任务建议：${unit.classroomTransfer.progressiveTasks.join("；") || "无"}`));
    children.push(p(`学习证据：${unit.classroomTransfer.learningEvidence}`));
    children.push(p("五、证据链表", { bold: true }));
    unit.evidenceChain.forEach((e) => {
      children.push(p(`${e.judgmentType}｜${e.conclusion}｜${e.evidenceSource}：${e.evidenceSummary}`));
    });
    children.push(p("六、最终结论", { bold: true }));
    children.push(p(unit.finalConclusion));
  }

  // 一、课标依据
  children.push(h1("一、课标依据"));
  children.push(p(input.standard || "待填写。"));

  // 二、教材与学情分析
  children.push(h1("二、教材与学情分析"));
  children.push(p(`学科：${input.subject || "待填写"}；年级：${input.grade || "待填写"}；课时：${input.duration || "待填写"}。`));
  children.push(p(`学生基础：${input.studentBase || "待填写。"}`));
  children.push(p(`教学难点：${input.difficulty || "待填写。"}`));

  // 三、教学目标（编号列表）
  children.push(h1("三、教学目标"));
  const goalList = goals ? [goals.basicGoal, goals.coreGoal, goals.challengeGoal] : [];
  if (goalList.length) {
    goalList.forEach((g, i) => children.push(p(`${i + 1}. ${g || "待生成。"}`)));
  } else {
    children.push(p("待生成教学目标。"));
  }

  // 四、评价证据（表格）
  children.push(h1("四、评价证据"));
  if (evidence.length) {
    children.push(
      gridTable(
        ["目标", "学生证据", "判断标准", "可能误区"],
        [22, 28, 25, 25],
        evidence.map((e) => [e.goal, e.studentEvidence, e.criteria, e.possibleMisunderstanding]),
      ),
    );
  } else {
    children.push(p("待生成评价证据。"));
  }

  // 五、学习任务链（表格）
  children.push(h1("五、学习任务链"));
  if (tasks.length) {
    children.push(
      gridTable(
        ["任务", "教师指令", "学生动作", "课堂产出", "对应目标"],
        [18, 24, 20, 20, 18],
        tasks.map((t) => [t.name, t.teacherInstruction, t.studentAction, t.classroomOutput, t.alignedGoal]),
      ),
    );
  } else {
    children.push(p("待生成任务链。"));
  }

  // 六、教学过程
  children.push(h1("六、教学过程"));
  if (tasks.length) {
    tasks.forEach((t) => {
      children.push(p(t.name, { bold: true, before: 80, after: 40 }));
      children.push(p(`教师指令：${t.teacherInstruction}`));
      children.push(p(`学生动作：${t.studentAction}`));
      children.push(p(`课堂产出：${t.classroomOutput}`));
    });
  } else {
    children.push(p("待根据任务链展开。"));
  }

  // 七、学生支架
  children.push(h1("七、学生支架"));
  if (support) {
    children.push(p(`低起点学生：${support.lowSupport}`));
    children.push(p(`中间层学生：${support.middleSupport}`));
    children.push(p(`高阶学生：${support.highChallenge}`));
  } else {
    children.push(p("待生成学生支架。"));
  }

  // 八、板书设计
  children.push(h1("八、板书设计"));
  children.push(p(topic));
  children.push(p("起风前（沉闷寂静）→ 凉风（报信）→ 大风（剧烈）→ 再次寂静（蓄势）→ 雷声（爆发）"));
  children.push(p("景物 · 声音 · 感受 —— 有顺序地写出“变化的过程”（变化地图）"));

  // 九、质量体检报告（表格）
  children.push(h1("九、质量体检报告"));
  if (quality.length) {
    children.push(
      gridTable(
        ["维度", "状态", "说明", "建议"],
        [20, 12, 38, 30],
        quality.map((q) => [q.dimension, q.status, q.comment, q.suggestion]),
      ),
    );
  } else {
    children.push(p("待生成质量体检。"));
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(`课标到课堂_教学设计_${extractTopicName(topic)}.docx`, blob);
}
