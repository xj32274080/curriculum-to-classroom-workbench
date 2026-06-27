// Thin, error-safe wrapper around POST /api/generate. Calls the local backend
// only (relative URL, proxied by Vite in dev). Never throws to the caller —
// callers handle the returned {error} shape so the UI never crashes.

import type { ApiStep, DesignInput, GenerateResponse, Provider, Results } from "./types";

export async function generate(
  step: ApiStep,
  input: DesignInput,
  draft: Partial<Results>,
): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step, input, draft }),
  });
  if (!res.ok) {
    throw new Error(`后端请求失败 (${res.status})`);
  }
  return (await res.json()) as GenerateResponse;
}

/** Reports the backend's resolved mode; defaults to mock on any error. */
export async function fetchMode(): Promise<Provider> {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return "mock";
    const data = (await res.json()) as { mode?: Provider };
    return data.mode || "mock";
  } catch {
    return "mock";
  }
}
