import type { DesignInput } from "../types";

interface Props {
  input: DesignInput;
  onChange: (field: keyof DesignInput, value: string) => void;
  onFillDemo: () => void;
  onStart: () => void;
}

export default function StartPanel({ input, onChange, onFillDemo, onStart }: Props) {
  return (
    <>
      <div className="form-grid">
        <div className="field-block">
          <label>学科</label>
          <input value={input.subject} placeholder="如：小学语文" onChange={(e) => onChange("subject", e.target.value)} />
        </div>
        <div className="field-block">
          <label>年级</label>
          <input value={input.grade} placeholder="如：四年级" onChange={(e) => onChange("grade", e.target.value)} />
        </div>
        <div className="field-block wide">
          <label>课标原文</label>
          <textarea
            value={input.standard}
            placeholder="粘贴明确的课标或学习要求"
            onChange={(e) => onChange("standard", e.target.value)}
          />
        </div>
        <div className="field-block">
          <label>教学主题</label>
          <input value={input.topic} placeholder="如：《精卫填海》神话阅读" onChange={(e) => onChange("topic", e.target.value)} />
        </div>
        <div className="field-block">
          <label>课时</label>
          <input value={input.duration} placeholder="如：1课时" onChange={(e) => onChange("duration", e.target.value)} />
        </div>
        <div className="field-block wide">
          <label>学生基础</label>
          <textarea
            value={input.studentBase}
            placeholder="学生已经会什么、容易卡在哪里"
            onChange={(e) => onChange("studentBase", e.target.value)}
          />
        </div>
        <div className="field-block wide">
          <label>教学难点</label>
          <textarea
            value={input.difficulty}
            placeholder="本课最需要突破的问题"
            onChange={(e) => onChange("difficulty", e.target.value)}
          />
        </div>
      </div>
      <div className="button-row">
        <button type="button" className="btn secondary" onClick={onFillDemo}>
          一键填入示例
        </button>
        <button type="button" className="btn green" onClick={onStart}>
          开始设计
        </button>
      </div>
      <div className="hint">
        <strong>演示建议：</strong>现场先用《精卫填海》跑通，再说明它可以替换为任意学科、课标和主题。
      </div>
    </>
  );
}
