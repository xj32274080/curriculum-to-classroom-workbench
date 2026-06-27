import type { DesignInput, NavStep, Results } from "../types";
import {
  EvidenceEditor,
  GoalsEditor,
  StandardEditor,
  SupportEditor,
  TasksEditor,
  UnitPositioningCard,
} from "./ResultCards";
import QualityCheckPanel from "./QualityCheckPanel";

interface Props {
  step: NavStep;
  input: DesignInput;
  results: Results;
  loading: boolean;
  unitLoading: boolean;
  finalLoading: boolean;
  hasFinal: boolean;
  onGenerate: () => void;
  onGenerateUnitPositioning: () => void;
  onEdit: (path: string, value: string) => void;
  onNext: () => void;
  onBuildFinal: () => void;
}

const STEP_HINTS: Record<string, string> = {
  standard: "课标不是贴在教案开头，而是要被拆成学生能表现出来的学习行为。",
  goals: '目标必须可观察。不要写"感受精神"，要写"能结合证据说明人物形象"。',
  evidence: "不是先想活动热不热闹，而是先想怎么证明学生真的学会了。",
  tasks: '不要做"导入—新授—练习—总结"的壳，要突出学生动作：读懂、找证据、解释、整合表达。',
  quality: "一份好教学设计，要能说明不同学生怎么进入任务，也要能主动暴露设计风险。",
};

function renderEditor(step: NavStep, results: Results, onEdit: (path: string, value: string) => void) {
  switch (step.key) {
    case "standard":
      return results.standard ? <StandardEditor data={results.standard} onEdit={onEdit} /> : null;
    case "goals":
      return results.goals ? <GoalsEditor data={results.goals} onEdit={onEdit} /> : null;
    case "evidence":
      return results.evidence ? <EvidenceEditor data={results.evidence} onEdit={onEdit} /> : null;
    case "tasks":
      return results.tasks ? <TasksEditor data={results.tasks} onEdit={onEdit} /> : null;
    case "quality":
      return results.support && results.quality ? (
        <>
          <SupportEditor data={results.support} onEdit={onEdit} />
          <QualityCheckPanel items={results.quality} />
        </>
      ) : null;
    default:
      return null;
  }
}

export default function StepWorkspace({
  step,
  input,
  results,
  loading,
  unitLoading,
  finalLoading,
  hasFinal,
  onGenerate,
  onGenerateUnitPositioning,
  onEdit,
  onNext,
  onBuildFinal,
}: Props) {
  const editor = renderEditor(step, results, onEdit);
  const hasResult =
    step.key === "quality"
      ? Boolean(results.support && results.quality)
      : Boolean((results as Record<string, unknown>)[step.key]);
  const generateLabel =
    step.key === "standard" && input.designMode === "unit-positioning" && !results.unitPositioning
      ? "生成单元定位"
      : `生成${step.name}`;
  const showStepGenerate = !(step.key === "standard" && input.designMode === "unit-positioning" && !results.unitPositioning);

  return (
    <>
      {step.key === "standard" && input.designMode === "unit-positioning" && (
        <>
          <div className="hint">
            <strong>单元定位模式：</strong>
            先分析整单元材料，再生成更精准的教学设计。
          </div>
          {!input.unitMaterial.trim() && (
            <div className="hint warn-hint">
              未提供整单元材料，当前只能做基础定位；建议补充单元导语、课后题或语文园地内容。
            </div>
          )}
          <div className="button-row">
            <button type="button" className="btn" onClick={onGenerateUnitPositioning} disabled={unitLoading}>
              {unitLoading ? "生成中" : results.unitPositioning ? "重新生成单元定位" : "生成单元定位"}
              {unitLoading && (
                <span className="loading-dot">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          </div>
          {results.unitPositioning && <UnitPositioningCard data={results.unitPositioning} />}
        </>
      )}

      <div className="hint">
        <strong>{step.name}：</strong>
        {STEP_HINTS[step.key]}
      </div>

      <div className="button-row">
        {showStepGenerate && (
          <button type="button" className="btn green" onClick={onGenerate} disabled={loading || unitLoading}>
            {loading || unitLoading ? "生成中" : generateLabel}
            {(loading || unitLoading) && (
              <span className="loading-dot">
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        )}
        {hasResult && step.key !== "quality" && (
          <button type="button" className="btn secondary" onClick={onNext}>
            下一步
          </button>
        )}
      </div>

      {editor}

      {step.key === "quality" && results.support && results.quality && (
        <div className="button-row">
          <button type="button" className="btn" onClick={onBuildFinal} disabled={finalLoading}>
            {finalLoading ? "生成中" : hasFinal ? "重新生成完整教学设计" : "生成完整教学设计"}
            {finalLoading && (
              <span className="loading-dot">
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
