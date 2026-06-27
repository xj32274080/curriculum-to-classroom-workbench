// Print-only formatted view of the lesson plan. Rendered into a hidden
// .print-area and revealed only via @media print (see styles.css). Uses the
// already-generated structured results — no new AI call.

import type { DesignInput, Results } from "../types";

export default function LessonPrintView({ input, results }: { input: DesignInput; results: Results }) {
  const topic = input.topic || "未命名主题";
  const goals = results.goals;
  const evidence = results.evidence || [];
  const tasks = results.tasks || [];
  const support = results.support;
  const quality = results.quality || [];

  return (
    <div className="pa-doc">
      <h1 className="pa-title">{topic}教学设计</h1>
      <p className="pa-sub">由“课标到课堂｜AI教学设计工作台”生成</p>

      <h2 className="pa-h1">一、课标依据</h2>
      <p className="pa-p">{input.standard || "待填写。"}</p>

      <h2 className="pa-h1">二、教材与学情分析</h2>
      <p className="pa-p">
        学科：{input.subject || "待填写"}；年级：{input.grade || "待填写"}；课时：{input.duration || "待填写"}。
      </p>
      <p className="pa-p">学生基础：{input.studentBase || "待填写。"}</p>
      <p className="pa-p">教学难点：{input.difficulty || "待填写。"}</p>

      <h2 className="pa-h1">三、教学目标</h2>
      {goals ? (
        <ol className="pa-list">
          <li>{goals.basicGoal}</li>
          <li>{goals.coreGoal}</li>
          <li>{goals.challengeGoal}</li>
        </ol>
      ) : (
        <p className="pa-p">待生成教学目标。</p>
      )}

      <h2 className="pa-h1">四、评价证据</h2>
      {evidence.length ? (
        <table className="pa-table">
          <thead>
            <tr>
              <th>目标</th>
              <th>学生证据</th>
              <th>判断标准</th>
              <th>可能误区</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((e, i) => (
              <tr key={i}>
                <td>{e.goal}</td>
                <td>{e.studentEvidence}</td>
                <td>{e.criteria}</td>
                <td>{e.possibleMisunderstanding}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pa-p">待生成评价证据。</p>
      )}

      <h2 className="pa-h1">五、学习任务链</h2>
      {tasks.length ? (
        <table className="pa-table">
          <thead>
            <tr>
              <th>任务</th>
              <th>教师指令</th>
              <th>学生动作</th>
              <th>课堂产出</th>
              <th>对应目标</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i}>
                <td>{t.name}</td>
                <td>{t.teacherInstruction}</td>
                <td>{t.studentAction}</td>
                <td>{t.classroomOutput}</td>
                <td>{t.alignedGoal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pa-p">待生成任务链。</p>
      )}

      <h2 className="pa-h1">六、教学过程</h2>
      {tasks.length ? (
        tasks.map((t, i) => (
          <div className="pa-block" key={i}>
            <p className="pa-p">
              <b>{t.name}</b>
            </p>
            <p className="pa-p">教师指令：{t.teacherInstruction}</p>
            <p className="pa-p">学生动作：{t.studentAction}</p>
            <p className="pa-p">课堂产出：{t.classroomOutput}</p>
          </div>
        ))
      ) : (
        <p className="pa-p">待根据任务链展开。</p>
      )}

      <h2 className="pa-h1">七、学生支架</h2>
      {support ? (
        <>
          <p className="pa-p">低起点学生：{support.lowSupport}</p>
          <p className="pa-p">中间层学生：{support.middleSupport}</p>
          <p className="pa-p">高阶学生：{support.highChallenge}</p>
        </>
      ) : (
        <p className="pa-p">待生成学生支架。</p>
      )}

      <h2 className="pa-h1">八、板书设计</h2>
      <p className="pa-p">{topic}</p>
      <p className="pa-p">起因 → 经过 → 结果</p>
      <p className="pa-p">词句证据 → 人物形象 → 神话精神</p>

      <h2 className="pa-h1">九、质量体检报告</h2>
      {quality.length ? (
        <table className="pa-table">
          <thead>
            <tr>
              <th>维度</th>
              <th>状态</th>
              <th>说明</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            {quality.map((q, i) => (
              <tr key={i}>
                <td>{q.dimension}</td>
                <td>{q.status}</td>
                <td>{q.comment}</td>
                <td>{q.suggestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pa-p">待生成质量体检。</p>
      )}
    </div>
  );
}
