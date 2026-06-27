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
  const topic = input.topic || "未命名主题";
  const goals = results.goals;
  const evidence = results.evidence || [];
  const tasks = results.tasks || [];
  const support = results.support;
  const quality = results.quality || [];

  const children: Array<Paragraph | Table> = [];

  // 标题（居中）+ 副标题
  children.push(center(`${topic}教学设计`, { bold: true, size: 36, after: 60 }));
  children.push(center('由“课标到课堂｜AI教学设计工作台”生成', { size: 20, color: "888888", after: 220 }));

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
  children.push(p("起因 → 经过 → 结果"));
  children.push(p("词句证据 → 人物形象 → 神话精神"));

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
  downloadBlob(`课标到课堂_教学设计_${extractTopicName(input.topic)}.docx`, blob);
}
