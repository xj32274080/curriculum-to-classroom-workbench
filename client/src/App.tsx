import { useCallback, useEffect, useState } from "react";
import StepNav from "./components/StepNav";
import StartPanel from "./components/StartPanel";
import StepWorkspace from "./components/StepWorkspace";
import PreviewPanel from "./components/PreviewPanel";
import LessonPrintView from "./components/LessonPrintView";
import { generate, fetchMode } from "./api";
import { clientMockForStep } from "./clientMock";
import { isBlank, setByPath } from "./utils";
import {
  DEMO_INPUT,
  EMPTY_INPUT,
  NAV_STEPS,
  type ApiStep,
  type DesignInput,
  type Evidence,
  type Goals,
  type Provider,
  type QualityItem,
  type Results,
  type StandardAnalysis,
  type Support,
  type TaskItem,
} from "./types";

export default function App() {
  const [input, setInput] = useState<DesignInput>(EMPTY_INPUT);
  const [results, setResults] = useState<Results>({});
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Provider>("mock");
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<ApiStep | null>(null);
  const [finalMarkdown, setFinalMarkdown] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchMode().then(setMode);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const inputReady = Boolean(input.topic && input.standard);

  const completed = [
    inputReady,
    Boolean(results.standard),
    Boolean(results.goals),
    Boolean(results.evidence),
    Boolean(results.tasks),
    Boolean(results.support && results.quality),
  ].filter(Boolean).length;

  // Stores a step's payload into the right slot of results state.
  const applyResult = useCallback((apiStep: ApiStep, data: unknown) => {
    setResults((prev) => {
      const next = { ...prev };
      switch (apiStep) {
        case "standard-analysis":
          next.standard = data as StandardAnalysis;
          break;
        case "goals":
          next.goals = data as Goals;
          break;
        case "evidence":
          next.evidence = data as Evidence[];
          break;
        case "task-chain":
          next.tasks = data as TaskItem[];
          break;
        case "support-quality": {
          const d = data as { support: Support; quality: QualityItem[] };
          next.support = d.support;
          next.quality = d.quality;
          break;
        }
        default:
          break;
      }
      return next;
    });
    if (apiStep === "final-lesson") {
      const d = data as { markdown: string };
      setFinalMarkdown(d.markdown);
    }
  }, []);

  // Runs one generation step. Always succeeds: real API -> mock fallback in the
  // backend; backend unreachable -> client-side safety-net mock.
  const runStep = useCallback(
    async (apiStep: ApiStep, opts?: { advance?: boolean }) => {
      setLoadingStep(apiStep);
      try {
        const resp = await generate(apiStep, input, results);
        applyResult(apiStep, resp.data);
        setMode(resp.mode);
        setFallbackMessage(resp.fallback ? resp.message || "真实模型调用失败，已自动切换演示模式。" : null);
        showToast(apiStep === "final-lesson" ? "完整教案已生成" : "已生成本步内容");
        if (opts?.advance && apiStep !== "support-quality") {
          setActive((a) => Math.min(a + 1, NAV_STEPS.length - 1));
        }
      } catch {
        // Network failure (e.g. backend killed): keep the demo alive locally.
        const data = clientMockForStep(apiStep, input, results);
        applyResult(apiStep, data);
        setMode("mock");
        setFallbackMessage("无法连接本地后端，已使用本地演示数据。");
        showToast(apiStep === "final-lesson" ? "完整教案已生成（本地）" : "已生成本步内容（本地）");
        if (opts?.advance && apiStep !== "support-quality") {
          setActive((a) => Math.min(a + 1, NAV_STEPS.length - 1));
        }
      } finally {
        setLoadingStep(null);
      }
    },
    [input, results, applyResult, showToast],
  );

  const handleGenerate = useCallback(() => {
    if (active === 0) return;
    void runStep(NAV_STEPS[active].apiStep, { advance: true });
  }, [active, runStep]);

  const handleBuildFinal = useCallback(() => {
    void runStep("final-lesson");
  }, [runStep]);

  const handleEdit = useCallback((path: string, value: string) => {
    setResults((prev) => setByPath(prev as Record<string, unknown>, path, value) as Results);
  }, []);

  const handleInputChange = useCallback((field: keyof DesignInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFillDemo = useCallback(() => {
    setInput({ ...DEMO_INPUT });
    showToast("已填入示例");
  }, [showToast]);

  const handleStart = useCallback(() => {
    if (isBlank(input.standard) || isBlank(input.topic)) {
      showToast("请先填写课标和主题");
      return;
    }
    setActive(1);
  }, [input.standard, input.topic, showToast]);

  const handleReset = useCallback(() => {
    setInput(EMPTY_INPUT);
    setResults({});
    setActive(0);
    setFinalMarkdown(null);
    setFallbackMessage(null);
    showToast("已重置");
  }, [showToast]);

  const step = NAV_STEPS[active];

  return (
    <>
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">课</div>
          <div>
            <h1>课标到课堂｜AI教学设计工作台</h1>
            <p>课标拆解 · 证据优先 · 任务链生成 · 质量体检</p>
          </div>
        </div>
        <div className="top-actions">
          <span className={`mode-pill ${mode === "mock" ? "mock" : "live"}`}>
            {mode === "mock" ? "演示模式 · MOCK" : `真实 API · ${mode.toUpperCase()}`}
          </span>
          <span className="dify-pill">支持 OpenAI / Anthropic / Dify</span>
        </div>
      </header>

      <main className="layout">
        <StepNav
          steps={NAV_STEPS}
          active={active}
          results={results}
          inputReady={inputReady}
          onSelect={setActive}
        />

        <section className="main">
          <div className="workspace-head">
            <div>
              <h2>
                {active + 1}. {step.name}
              </h2>
              <p>{step.intro}</p>
            </div>
            <span className="head-tag">{step.desc}</span>
          </div>

          {active === 0 ? (
            <StartPanel
              input={input}
              onChange={handleInputChange}
              onFillDemo={handleFillDemo}
              onStart={handleStart}
            />
          ) : (
            <StepWorkspace
              step={step}
              results={results}
              loading={loadingStep === step.apiStep}
              finalLoading={loadingStep === "final-lesson"}
              hasFinal={Boolean(finalMarkdown)}
              onGenerate={handleGenerate}
              onEdit={handleEdit}
              onNext={() => setActive((a) => Math.min(a + 1, NAV_STEPS.length - 1))}
              onBuildFinal={handleBuildFinal}
            />
          )}
        </section>

        <PreviewPanel
          input={input}
          results={results}
          finalMarkdown={finalMarkdown}
          mode={mode}
          fallbackMessage={fallbackMessage}
          completed={completed}
          onToast={showToast}
          onReset={handleReset}
        />
      </main>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      </div>

      {finalMarkdown && (
        <div className="print-area">
          <LessonPrintView input={input} results={results} />
        </div>
      )}
    </>
  );
}
