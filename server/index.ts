// Express backend. Loads the single root .env (server never ships keys to the
// client), exposes POST /api/generate and GET /api/health, and never crashes
// on generation errors (handleGenerate always returns a usable result).

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { handleGenerate } from "./generateLesson.js";
import { resolveProvider } from "./aiClient.js";
import type { ApiStep, GenerateRequest } from "./types.js";

// Load .env from the project root (one level above server/).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: resolveProvider() });
});

app.post("/api/generate", async (req, res) => {
  try {
    const body = req.body || {};
    const step = body.step as ApiStep | undefined;
    if (!step) {
      return res.status(400).json({ success: false, error: "缺少 step 字段" });
    }
    const request: GenerateRequest = {
      step,
      input: body.input || {},
      draft: body.draft || {},
    };
    const response = await handleGenerate(request);
    res.json(response);
  } catch (err) {
    // Should be unreachable because of mock fallback, but guard anyway.
    console.error("[/api/generate] unhandled error:", err);
    res.status(500).json({ success: false, error: "服务器内部错误" });
  }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  const mode = resolveProvider();
  console.log("----------------------------------------------------------");
  console.log(`[server] 课标到课堂｜AI教学设计工作台 后端已启动`);
  console.log(`[server] 地址: http://localhost:${PORT}`);
  console.log(`[server] 模式: ${mode === "mock" ? "演示模式 (mock)" : `真实 API (${mode})`}`);
  console.log(`[server] /api/generate  /api/health`);
  console.log("----------------------------------------------------------");
});
