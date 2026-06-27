// Orchestrator: thin layer over aiClient.runGeneration that shapes the response
// into the documented API contract. Keeps index.ts free of domain logic.

import { runGeneration } from "./aiClient.js";
import type { GenerateRequest, GenerateResponse } from "./types.js";

export async function handleGenerate(req: GenerateRequest): Promise<GenerateResponse> {
  const result = await runGeneration(req);
  const response: GenerateResponse = {
    success: true,
    mode: result.mode,
    step: req.step,
    data: result.data,
  };
  if (result.fallback) response.fallback = true;
  if (result.message) response.message = result.message;
  return response;
}
