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
      <div className="mode-options" role="radiogroup" aria-label="设计模式">
        <label className={`mode-card ${input.designMode === "quick" ? "active" : ""}`}>
          <input
            type="radio"
            name="designMode"
            checked={input.designMode === "quick"}
            onChange={() => onChange("designMode", "quick")}
          />
          <span>快速设计</span>
          <small>输入课标、主题和学情，快速生成基础版教学设计。</small>
        </label>
        <label className={`mode-card ${input.designMode === "unit-positioning" ? "active" : ""}`}>
          <input
            type="radio"
            name="designMode"
            checked={input.designMode === "unit-positioning"}
            onChange={() => onChange("designMode", "unit-positioning")}
          />
          <span>单元定位设计</span>
          <small>提供整单元材料，先判断本课在单元中的教学功能，再生成精准教学设计。</small>
        </label>
      </div>
      <div className="hint">
        {input.designMode === "unit-positioning"
          ? "单元定位模式：先分析整单元材料，再生成更精准的教学设计。"
          : "快速模式：基于课标、主题和学情生成基础版设计。"}
      </div>
      {input.designMode === "unit-positioning" && !input.unitMaterial.trim() && (
        <div className="hint warn-hint">
          未提供整单元材料，当前只能做基础定位；建议补充单元导语、课后题或语文园地内容。
        </div>
      )}
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
        {input.designMode === "unit-positioning" && (
          <>
            <div className="field-block">
              <label>当前课文</label>
              <input
                value={input.currentTextTitle}
                placeholder="如：精卫填海"
                onChange={(e) => onChange("currentTextTitle", e.target.value)}
              />
            </div>
            <div className="field-block">
              <label>教材版本 / 单元信息</label>
              <input
                value={input.textbook}
                placeholder="如：统编版四年级上册第四单元"
                onChange={(e) => onChange("textbook", e.target.value)}
              />
            </div>
            <div className="field-block wide">
              <label>整单元材料</label>
              <textarea
                value={input.unitMaterial}
                placeholder="可粘贴单元导语、课文目录、课后题、语文园地等"
                onChange={(e) => onChange("unitMaterial", e.target.value)}
              />
            </div>
            <div className="field-block wide">
              <label>课文原文或教材片段</label>
              <textarea
                value={input.textContent}
                placeholder="可粘贴当前课文原文、重点段落或教材片段"
                onChange={(e) => onChange("textContent", e.target.value)}
              />
            </div>
          </>
        )}
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
