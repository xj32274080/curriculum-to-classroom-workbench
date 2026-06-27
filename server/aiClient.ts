// AI client: resolves the active provider, calls OpenAI / Anthropic / Dify via
// native fetch, extracts JSON, and guarantees a usable result by falling back
// to mock on any failure. No SDKs — fewer moving parts for a hackathon demo.
// API keys are read ONLY here, from process.env (loaded by index.ts).

import type { ApiStep, DesignInput, GenerateRequest, Provider, Results } from "./types.js";
import { PROMPT_BUILDERS } from "./prompts.js";
import { getMockResult, buildFinalMarkdown } from "./mockData.js";

const SYSTEM =
  "你是面向小学语文教师的教学设计专家。请把课标要求转化为可观察、可评价、可在课堂中落实的学习目标；围绕目标设计评价证据和任务链，说明学生要做什么、产出什么、教师如何判断。避免空泛口号、泛化表述和脱离文本的套话，输出要具体、结构清晰、便于教师直接修改使用。";
const TIMEOUT_MS = 45_000;

function env(k: string): string {
  return (process.env[k] || "").trim();
}

function keyFor(provider: Provider): string {
  if (provider === "openai") return env("OPENAI_API_KEY");
  if (provider === "anthropic") return env("ANTHROPIC_API_KEY");
  if (provider === "dify") return env("DIFY_API_KEY");
  return "";
}

/** Decides the effective provider: mock wins; a provider with no key also falls to mock. */
export function resolveProvider(): Provider {
  const mockMode = env("MOCK_MODE").toLowerCase() === "true";
  const provider = (env("API_PROVIDER") || "mock").toLowerCase() as Provider;
  if (mockMode) return "mock";
  if (!["openai", "anthropic", "dify"].includes(provider)) return "mock";
  if (!keyFor(provider)) return "mock";
  return provider;
}

export interface RunResult {
  mode: Provider;
  data: unknown;
  fallback?: boolean;
  message?: string;
}

/** Pulls the first balanced {...} or [...] block out of a model response and parses it. */
export function extractJson(text: string): unknown {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();

  const start = t.search(/[[{]/);
  if (start === -1) throw new Error("返回内容中没有找到 JSON");
  const open = t[start];
  const close = open === "{" ? "}" : "]";

  let depth = 0;
  let end = -1;
  let inStr = false;
  let esc = false;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error("返回的 JSON 未闭合");
  return JSON.parse(t.slice(start, end + 1));
}

/** Lightweight shape check — enough to catch a model returning the wrong structure. */
function validateShape(step: ApiStep, data: unknown): void {
  const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
  const fail = (msg: string) => {
    throw new Error("返回结构异常: " + msg);
  };
  switch (step) {
    case "unit-positioning":
    case "standard-analysis":
    case "goals":
      if (!isObj(data)) fail(`应为对象，实际为 ${Array.isArray(data) ? "数组" : typeof data}`);
      break;
    case "evidence":
    case "task-chain":
      if (!Array.isArray(data)) fail(`应为数组，实际为 ${typeof data}`);
      break;
    case "support-quality": {
      if (!isObj(data)) fail("应为对象");
      const d = data as Record<string, unknown>;
      if (!isObj(d.support) || !Array.isArray(d.quality)) fail("缺少 support 或 quality");
      break;
    }
    default:
      break;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  return res;
}

async function callOpenAI(prompt: string, json: boolean): Promise<string> {
  const base = env("OPENAI_BASE_URL") || "https://api.openai.com/v1";
  const res = await fetchWithTimeout(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyFor("openai")}`,
    },
    body: JSON.stringify({
      model: env("OPENAI_MODEL") || "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status} ${await safeText(res)}`);
  const json_body = await res.json();
  const text = json_body?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI 返回为空");
  return text;
}

async function callAnthropic(prompt: string): Promise<string> {
  const base = env("ANTHROPIC_BASE_URL") || "https://api.anthropic.com/v1";
  const res = await fetchWithTimeout(`${base}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": keyFor("anthropic"),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env("ANTHROPIC_MODEL") || "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status} ${await safeText(res)}`);
  const body = await res.json();
  const text = body?.content?.[0]?.text;
  if (!text) throw new Error("Anthropic 返回为空");
  return text;
}

async function callDify(prompt: string): Promise<string> {
  const base = env("DIFY_API_BASE") || "https://api.dify.ai/v1";
  // Blocking mode returns the full `answer` in one shot — simpler than SSE for
  // structured single-shot generation. Each call is an independent conversation.
  const res = await fetchWithTimeout(`${base}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyFor("dify")}`,
    },
    body: JSON.stringify({
      inputs: {},
      query: prompt,
      response_mode: "blocking",
      conversation_id: "",
      user: "ccw-user",
      auto_generate_name: false,
    }),
  });
  if (!res.ok) throw new Error(`Dify ${res.status} ${await safeText(res)}`);
  const body = await res.json();
  const text = body?.answer || body?.data?.outputs?.answer || body?.data?.outputs?.text;
  if (!text) throw new Error("Dify 返回 answer 为空");
  return text;
}

async function callProvider(provider: Provider, prompt: string, json: boolean): Promise<string> {
  if (provider === "openai") return callOpenAI(prompt, json);
  if (provider === "anthropic") return callAnthropic(prompt);
  if (provider === "dify") return callDify(prompt);
  throw new Error(`未知 provider: ${provider}`);
}

async function safeText(res: Response): Promise<string> {
  try {
    const t = (await res.text()).slice(0, 200);
    return t ? `: ${t}` : "";
  } catch {
    return "";
  }
}

function mockForStep(step: ApiStep, input: DesignInput, draft: Partial<Results>): unknown {
  if (step === "final-lesson") return { markdown: buildFinalMarkdown(input, draft) };
  return getMockResult(step, input);
}

/** Main entry: build prompt, call provider, parse; on ANY failure -> mock. */
export async function runGeneration(req: GenerateRequest): Promise<RunResult> {
  const { step, input, draft } = req;
  const provider = resolveProvider();

  if (provider === "mock") {
    return { mode: "mock", data: mockForStep(step, input, draft) };
  }

  try {
    const builder = (PROMPT_BUILDERS as Record<string, (i: DesignInput, d: Partial<Results>) => string>)[step];
    if (!builder) throw new Error(`没有该步骤的 prompt 构造器: ${step}`);
    const prompt = builder(input, draft || {});
    const expectJson = step !== "final-lesson";

    const text = await callProvider(provider, prompt, expectJson);

    if (!expectJson) {
      return { mode: provider, data: { markdown: text.trim() } };
    }
    const data = extractJson(text);
    validateShape(step, data);
    return { mode: provider, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[aiClient] step=${step} provider=${provider} 调用失败，回退 mock：${msg}`);
    return {
      mode: "mock",
      data: mockForStep(step, input, draft),
      fallback: true,
      message: "真实模型调用失败，已自动切换演示模式。",
    };
  }
}
