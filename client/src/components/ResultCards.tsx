// Editable structured cards for steps 2-6. Each editor renders the data the
// backend returned for its step and forwards edits up via onEdit(path, value).
// Array-valued fields (keywords etc.) are newline-separated in a textarea and
// re-split by utils.setByPath on the way into state.

import type { Evidence, Goals, StandardAnalysis, Support, TaskItem, UnitAnalysisReport } from "../types";

type EditFn = (path: string, value: string) => void;

/** 证据链判断性质 → 小标签样式（纯展示，不改变数据） */
function evTagClass(t: UnitAnalysisReport["evidenceChain"][number]["judgmentType"]): string {
  if (t === "明确判断") return "ev-tag--strong";
  if (t === "较强判断") return "ev-tag--medium";
  if (t === "谨慎判断") return "ev-tag--caution";
  return "ev-tag--weak";
}

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

export function UnitAnalysisReportPanel({ data }: { data: UnitAnalysisReport }) {
  return (
    <div className="report-panel">
      <h3>单元定位型文本解读报告</h3>
      <section className="report-section">
        <h4>一、单元扫描结果</h4>
        <div className="mini">
          <b>语文要素</b>
          {data.unitScan.chineseElement}
        </div>
        <div className="mini">
          <b>单元主题任务</b>
          {data.unitScan.unitThemeTask}
        </div>
        <div className="mini">
          <b>编排关系</b>
          {data.unitScan.arrangementLogic}
        </div>
        <div className="mini">
          <b>当前课文位置</b>
          {data.unitScan.currentTextPosition}
        </div>
        <div className="mini">
          <b>初步判断</b>
          {data.unitScan.initialJudgment}
        </div>
      </section>

      <section className="report-section">
        <h4>二、当前课文深度解读</h4>
        <div className="mini">
          <b>最值得教的地方</b>
          {data.textDeepReading.mostWorthTeaching}
        </div>
        <div className="mini">
          <b>核心教学支撑</b>
          {data.textDeepReading.coreTeachingSupport}
        </div>
        <div className="mini">
          <b>唯一核心能力</b>
          {data.textDeepReading.oneCoreAbility}
        </div>
        <div className="mini">
          <b>常见误读</b>
          {data.textDeepReading.commonMisreadings.join("；") || "无"}
        </div>
      </section>

      <section className="report-section">
        <h4>三、儿童起点与理解路径分析</h4>
        <div className="mini">
          <b>进入点</b>
          {data.studentPath.entryPoints}
        </div>
        <div className="mini">
          <b>可能障碍</b>
          {data.studentPath.likelyObstacles.join("；") || "无"}
        </div>
        <div className="mini">
          <b>适合抵达的感受</b>
          {data.studentPath.suitableFeelings}
        </div>
        <div className="mini">
          <b>年级衔接</b>
          {data.studentPath.gradeConnection}
        </div>
      </section>

      <section className="report-section">
        <h4>四、课堂转化设计</h4>
        <div className="mini">
          <b>一句话课时定位</b>
          {data.classroomTransfer.oneSentenceLessonPosition}
        </div>
        <div className="mini">
          <b>核心抓手</b>
          {data.classroomTransfer.coreHandle}
        </div>
        <div className="mini">
          <b>进入建议</b>
          {data.classroomTransfer.entrySuggestion}
        </div>
        <div className="mini">
          <b>递进任务建议</b>
          {data.classroomTransfer.progressiveTasks.join("；") || "无"}
        </div>
        <div className="mini">
          <b>学习证据</b>
          {data.classroomTransfer.learningEvidence}
        </div>
        <div className="mini">
          <b>教学提醒</b>
          {data.classroomTransfer.teachingWarnings.join("；") || "无"}
        </div>
      </section>

      <section className="report-section">
        <h4>五、证据链表</h4>
        <div className="table-like">
          {data.evidenceChain.map((item, index) => (
            <div className="row-card ev-row" key={index}>
              <span className={`ev-tag ${evTagClass(item.judgmentType)}`}>{item.judgmentType}</span>
              <p><b>结论：</b>{item.conclusion}</p>
              <p><b>证据来源：</b>{item.evidenceSource}</p>
              <p><b>证据摘要：</b>{item.evidenceSummary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="report-section">
        <h4>六、最终结论</h4>
        <div className="mini">{data.finalConclusion}</div>
      </section>
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
