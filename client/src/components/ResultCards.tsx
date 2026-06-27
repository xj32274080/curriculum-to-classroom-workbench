// Editable structured cards for steps 2-6. Each editor renders the data the
// backend returned for its step and forwards edits up via onEdit(path, value).
// Array-valued fields (keywords etc.) are newline-separated in a textarea and
// re-split by utils.setByPath on the way into state.

import type { Evidence, Goals, StandardAnalysis, Support, TaskItem, UnitPositioning } from "../types";

type EditFn = (path: string, value: string) => void;

export function ArrayCard({
  title,
  path,
  items,
  onEdit,
}: {
  title: string;
  path: string;
  items: string[];
  onEdit: EditFn;
}) {
  return (
    <div className="card">
      <div className="card-title">
        {title}
        <small>可编辑 · 每行一条</small>
      </div>
      <textarea className="editable" value={items.join("\n")} onChange={(e) => onEdit(path, e.target.value)} />
    </div>
  );
}

export function TextCard({
  title,
  path,
  text,
  onEdit,
}: {
  title: string;
  path: string;
  text: string;
  onEdit: EditFn;
}) {
  return (
    <div className="card">
      <div className="card-title">
        {title}
        <small>可编辑</small>
      </div>
      <textarea className="editable" value={text} onChange={(e) => onEdit(path, e.target.value)} />
    </div>
  );
}

export function StandardEditor({ data, onEdit }: { data: StandardAnalysis; onEdit: EditFn }) {
  return (
    <div className="cards">
      <ArrayCard title="课标关键词" path="standard.keywords" items={data.keywords} onEdit={onEdit} />
      <ArrayCard title="指向的核心能力" path="standard.coreAbilities" items={data.coreAbilities} onEdit={onEdit} />
      <ArrayCard
        title="本课可观察学习表现"
        path="standard.observablePerformances"
        items={data.observablePerformances}
        onEdit={onEdit}
      />
      <ArrayCard title="容易写空的地方" path="standard.riskWarnings" items={data.riskWarnings} onEdit={onEdit} />
    </div>
  );
}

export function UnitPositioningCard({ data }: { data: UnitPositioning }) {
  return (
    <div className="card unit-card">
      <div className="card-title">单元定位卡片</div>
      <div className="mini-grid">
        <div className="mini">
          <b>单元主题</b>
          {data.unitTheme}
        </div>
        <div className="mini">
          <b>语文要素</b>
          {data.chineseElement}
        </div>
        <div className="mini">
          <b>编排关系</b>
          {data.textArrangement}
        </div>
        <div className="mini">
          <b>当前课文功能</b>
          {data.currentTextFunction}
        </div>
        <div className="mini">
          <b>核心教学抓手</b>
          {data.coreTeachingFocus}
        </div>
        <div className="mini">
          <b>不宜过度展开</b>
          {data.notSuitableForExpansion.length ? data.notSuitableForExpansion.join("；") : "无"}
        </div>
      </div>
    </div>
  );
}

export function GoalsEditor({ data, onEdit }: { data: Goals; onEdit: EditFn }) {
  return (
    <div className="cards">
      <TextCard title="基础目标" path="goals.basicGoal" text={data.basicGoal} onEdit={onEdit} />
      <TextCard title="核心目标" path="goals.coreGoal" text={data.coreGoal} onEdit={onEdit} />
      <TextCard title="挑战目标" path="goals.challengeGoal" text={data.challengeGoal} onEdit={onEdit} />
    </div>
  );
}

export function EvidenceEditor({ data, onEdit }: { data: Evidence[]; onEdit: EditFn }) {
  return (
    <div className="table-like">
      {data.map((x, idx) => (
        <div className="row-card" key={idx}>
          <h4>证据 {idx + 1}</h4>
          <div className="mini-grid">
            <div className="mini">
              <b>对应目标</b>
              <textarea
                className="editable"
                value={x.goal}
                onChange={(e) => onEdit(`evidence.${idx}.goal`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>学生证据</b>
              <textarea
                className="editable"
                value={x.studentEvidence}
                onChange={(e) => onEdit(`evidence.${idx}.studentEvidence`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>判断标准</b>
              <textarea
                className="editable"
                value={x.criteria}
                onChange={(e) => onEdit(`evidence.${idx}.criteria`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>可能误区</b>
              <textarea
                className="editable"
                value={x.possibleMisunderstanding}
                onChange={(e) => onEdit(`evidence.${idx}.possibleMisunderstanding`, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TasksEditor({ data, onEdit }: { data: TaskItem[]; onEdit: EditFn }) {
  return (
    <div className="table-like">
      {data.map((x, idx) => (
        <div className="row-card" key={idx}>
          <h4>{x.name}</h4>
          <div className="mini-grid">
            <div className="mini">
              <b>教师指令</b>
              <textarea
                className="editable"
                value={x.teacherInstruction}
                onChange={(e) => onEdit(`tasks.${idx}.teacherInstruction`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>学生动作</b>
              <textarea
                className="editable"
                value={x.studentAction}
                onChange={(e) => onEdit(`tasks.${idx}.studentAction`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>课堂产出</b>
              <textarea
                className="editable"
                value={x.classroomOutput}
                onChange={(e) => onEdit(`tasks.${idx}.classroomOutput`, e.target.value)}
              />
            </div>
            <div className="mini">
              <b>对应目标</b>
              <textarea
                className="editable"
                value={x.alignedGoal}
                onChange={(e) => onEdit(`tasks.${idx}.alignedGoal`, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SupportEditor({ data, onEdit }: { data: Support; onEdit: EditFn }) {
  return (
    <div className="cards">
      <TextCard title="低起点学生支架" path="support.lowSupport" text={data.lowSupport} onEdit={onEdit} />
      <TextCard title="中间层学生支架" path="support.middleSupport" text={data.middleSupport} onEdit={onEdit} />
      <TextCard title="高阶学生挑战" path="support.highChallenge" text={data.highChallenge} onEdit={onEdit} />
    </div>
  );
}
