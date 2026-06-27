import { useState } from "react";
import type { DesignInput, Provider, Results } from "../types";
import { buildFinalMarkdown } from "../markdown";
import { copyToClipboard, downloadText, sanitizeFilename } from "../utils";
import FinalLessonPanel from "./FinalLessonPanel";
import { UnitAnalysisReportPanel } from "./ResultCards";

interface Props {
  input: DesignInput;
  results: Results;
  finalMarkdown: string | null;
  mode: Provider;
  fallbackMessage: string | null;
  completed: number;
  onToast: (msg: string) => void;
  onReset: () => void;
}

type Tab = "preview" | "assistant";

export default function PreviewPanel({
  input,
  results,
  finalMarkdown,
  mode,
  fallbackMessage,
  completed,
  onToast,
  onReset,
}: Props) {
  const [tab, setTab] = useState<Tab>("preview");
  const liveMd = buildFinalMarkdown(input, results);
  const md = finalMarkdown ?? liveMd;
  const pct = Math.round((completed / 6) * 100);

  const bannerClass = fallbackMessage
    ? "mode-banner fallback"
    : mode === "mock"
      ? "mode-banner mock"
      : "mode-banner";
  const bannerText = fallbackMessage
    ? fallbackMessage
    : mode === "mock"
      ? "当前为演示模式，流程可完整体验。"
      : "当前为真实 API 模式，正在调用大模型。";

  const handleCopy = async () => {
    const ok = await copyToClipboard(md);
    onToast(ok ? "已复制 Markdown" : "复制失败，请手动选择文本");
  };

  const handleDownload = () => {
    downloadText(`${sanitizeFilename(input.topic || input.currentTextTitle)}.md`, md);
    onToast("已下载 .md 文件");
  };

  const handleWord = async () => {
    if (!finalMarkdown) {
      onToast("请先生成完整教学设计");
      return;
    }
    try {
      // Lazy-load the docx library so it never weighs down the initial page load.
      const { exportLessonToDocx } = await import("../lessonDocx");
      await exportLessonToDocx(input, results);
      onToast("已下载 Word 文档");
    } catch (err) {
      console.error("Word 导出失败：", err);
      onToast("Word 生成失败，请先使用复制 Markdown 或打印 PDF。");
    }
  };

  const handlePrint = () => {
    if (!finalMarkdown) {
      onToast("请先生成完整教学设计");
      return;
    }
    window.print();
  };

  return (
    <aside className="preview">
      <div className="preview-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "preview"}
          className={`tab ${tab === "preview" ? "active" : ""}`}
          onClick={() => setTab("preview")}
        >
          教学设计预览
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "assistant"}
          className={`tab ${tab === "assistant" ? "active" : ""}`}
          onClick={() => setTab("assistant")}
        >
          AI 引导助手
        </button>
      </div>

      {tab === "preview" ? (
        <div className="preview-tab-pane">
          <div className="progress">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="mode-banner">
            {input.designMode === "unit-analysis"
              ? "单元精准模式：先生成单元定位型文本解读报告，再进入更精准的教学设计。"
              : "快速模式：基于课标、主题和学情生成基础版设计。"}
          </div>
          {input.designMode === "unit-analysis" && !input.unitMaterial.trim() && (
            <div className="mode-banner fallback">
              单元材料不足，无法完成标准的单元定位型分析。请补充单元导语、课文目录、课后题或语文园地内容。
            </div>
          )}
          <div className={bannerClass}>{bannerText}</div>
          {results.unitAnalysisReport && <UnitAnalysisReportPanel data={results.unitAnalysisReport} />}
          {finalMarkdown ? (
            <FinalLessonPanel markdown={finalMarkdown} />
          ) : (
            <div className="preview-box">{md || "请先填写设计起点并逐步生成。"}</div>
          )}
          <div className="button-row">
            <button type="button" className="btn green" onClick={handleCopy}>
              复制Markdown
            </button>
            <button type="button" className="btn secondary" onClick={handleDownload}>
              下载 .md
            </button>
            <button
              type="button"
              className="btn green"
              onClick={handleWord}
              disabled={!finalMarkdown}
              title={finalMarkdown ? "下载 Word 文档" : "请先生成完整教学设计"}
            >
              下载 Word
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={handlePrint}
              disabled={!finalMarkdown}
              title={finalMarkdown ? "打印或另存为 PDF" : "请先生成完整教学设计"}
            >
              打印 / 导出 PDF
            </button>
            <button type="button" className="btn warn" onClick={onReset}>
              重新开始
            </button>
          </div>
        </div>
      ) : (
        <div className="assistant-tab-pane">
          <div className="assistant-card">
            <div className="assistant-head">
              <h3>AI 引导助手</h3>
              <p className="assistant-sub">可用于追问课标拆解、目标定位、评价证据和任务链设计。</p>
            </div>
            <div className="assistant-note">
              AI 引导助手用于补充追问、解释设计思路和帮助修改表达；正式成果仍以六步工作台生成内容为准。
            </div>
            <div className="assistant-iframe-wrap">
              <iframe
                src="https://udify.app/chatbot/hvtT94ljurxSFeyC"
                title="AI 引导助手"
                frameBorder="0"
                allow="microphone"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
