import type { NavStep, Results } from "../types";

interface Props {
  steps: NavStep[];
  active: number;
  results: Results;
  inputReady: boolean;
  onSelect: (index: number) => void;
}

export function isStepDone(step: NavStep, results: Results, inputReady: boolean): boolean {
  if (step.key === "start") return inputReady;
  if (step.key === "quality") return Boolean(results.support && results.quality);
  return Boolean(results[step.key]);
}

export default function StepNav({ steps, active, results, inputReady, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <p className="side-title">设计流程</p>
      <div className="step-list">
        {steps.map((s, i) => {
          const done = isStepDone(s, results, inputReady);
          return (
            <button
              key={s.key}
              type="button"
              className={`step-btn ${i === active ? "active" : ""} ${done ? "done" : ""}`}
              onClick={() => onSelect(i)}
            >
              <span className="step-no">{done ? "✓" : String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="step-name">{s.name}</span>
                <span className="step-desc">{s.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="sidebar-note">
        <b>产品判断：</b>这不是一键教案生成器，而是把教师的教学设计思考过程变成可见流程。
      </div>
    </aside>
  );
}
