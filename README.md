# 课标到课堂｜AI 教学设计工作台

> 把“好的教学设计流程”做成工作台：输入明确的课标与主题，工作台带老师走过
> **课标拆解 → 目标定位 → 评价证据 → 学习任务链 → 学生支架 → 质量体检**，
> 产出一份**目标、评价、活动相互对齐**的完整教学设计（可复制 Markdown）。

这不是“输入主题一键生成教案”的低级工具，也不是纯聊天机器人，而是一个
**流程化教学设计工作台**：每一步都有结构化中间产出、可编辑，最后合成为完整教案。

本工具支持两种设计入口：

1. **快速设计**：课标 + 主题 + 学情，快速生成基础版教学设计。
2. **单元精准设计**：整单元材料 + 当前课文 + 学情，先生成“单元定位型文本解读报告”，再进入目标、证据和任务链设计。

其中，单元精准设计更符合小学语文真实备课逻辑，因为它先判断“这篇课文在本单元中到底承担什么功能”，再进入目标和任务链设计，避免把一篇课文的所有价值平均展开。

本项目的专业主提示词来自《小学语文单元定位型文本解读提示词 3.0》。它不是直接生成教案，而是先通过整单元材料建立教材坐标，再锁定当前课文，最后压缩成课时定位、核心抓手、递进任务和学习证据。

---

## 一、快速开始（本地可运行 / 现场可演示）

```bash
# 1. 进入项目目录
cd curriculum-to-classroom-workbench

# 2. 一条命令安装根目录 + 前端 + 后端依赖
npm install

# 3. 一条命令同时启动前后端
npm run dev
```

启动后：

- **前端**：http://localhost:5173 （浏览器打开这个）
- **后端**：http://localhost:3001 （`/api/generate`、`/api/health`）

> 默认就是 **演示模式（mock）**，无需任何 API Key 即可完整体验六步流程。

### 演示动线（约 2 分钟）

1. 打开 http://localhost:5173，点击 **「一键填入示例」**（自动填入《精卫填海》课例）。
2. 可保持 **快速设计**，也可切换到 **单元精准设计**，补充或查看整单元材料。
3. 点击 **「开始设计」**。若为单元精准模式，先生成 **单元定位型文本解读报告**。
4. 依次在 2–6 步点击 **「生成本步内容」**，观察中间结构化卡片。
5. 任意卡片**可直接编辑**，右侧预览实时同步。
6. 第 6 步生成支架与质检后，点击 **「生成完整教学设计」**。
7. 右侧出现完整 Markdown，点 **「复制Markdown」** 或 **「下载 .md」**。

---

## 二、技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 18 + Vite 5 + TypeScript（纯 CSS，无 Tailwind） |
| 后端 | Node.js + Express + TypeScript（`tsx` 直跑，ESM） |
| 通信 | 前端只请求本地后端 `POST /api/generate`（Vite 代理 `/api`） |
| AI | 原生 `fetch` 调用 OpenAI / Anthropic / Dify，默认 mock，失败自动回退 mock |

目录结构：

```
curriculum-to-classroom-workbench/
├─ package.json            # 根：concurrently 同时启动前后端；postinstall 安装子项目
├─ scripts/install-deps.js # 安装 client/ 与 server/ 依赖（Windows 友好，无 cd）
├─ .env.example            # 环境变量模板（复制为 .env）
├─ .gitignore
├─ README.md
├─ client/                 # 前端
│  ├─ index.html
│  ├─ vite.config.ts       # 5173，代理 /api -> 3001
│  └─ src/
│     ├─ App.tsx           # 三栏布局 + 全局状态 + 步骤路由
│     ├─ api.ts            # /api/generate 与 /api/health 封装
│     ├─ markdown.ts       # 完整教案 Markdown 装配（与后端一致）
│     ├─ clientMock.ts     # 仅当后端不可达时的本地兜底数据
│     ├─ types.ts / utils.ts / styles.ts(css)
│     └─ components/        # StepNav / StartPanel / StepWorkspace /
│                           # ResultCards / QualityCheckPanel / PreviewPanel / FinalLessonPanel
└─ server/                 # 后端
   ├─ index.ts             # Express，/api/generate、/api/health
   ├─ types.ts             # 领域类型
   ├─ mockData.ts          # mock 数据 + 完整 Markdown 装配
   ├─ prompts.ts           # 六步各自的 prompt 构造器（不写一个巨型 prompt）
   ├─ aiClient.ts          # 三家 provider 调用 + JSON 解析 + 失败回退
   └─ generateLesson.ts    # 编排：路由 step -> prompt -> 调用 -> 解析 -> 兜底
```

---

## 三、环境变量（安全：所有 Key 仅在后端读取）

复制 `.env.example` 为 `.env` 后按需修改。**默认即可演示（mock）。**

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `API_PROVIDER` | `mock` | `mock` / `openai` / `anthropic` / `dify` |
| `MOCK_MODE` | `true` | `true` 时强制 mock，即使配了真实 Key |
| `PORT` | `3001` | 后端端口 |
| `OPENAI_API_KEY` / `OPENAI_MODEL` / `OPENAI_BASE_URL` | — | OpenAI |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` / `ANTHROPIC_BASE_URL` | — | Anthropic |
| `DIFY_API_KEY` / `DIFY_API_BASE` | `https://api.dify.ai/v1` | Dify |

> ⚠️ **API Key 只写进根目录 `.env`，由后端读取。前端代码、前端构建产物、浏览器请求里都不会出现 Key。**
> `.env` 已被 `.gitignore` 忽略。

### 接入真实模型示例

```bash
# OpenAI
API_PROVIDER=openai
OPENAI_API_KEY=sk-xxxx
OPENAI_MODEL=gpt-4o-mini

# 或 Anthropic
API_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxxx
ANTHROPIC_MODEL=claude-sonnet-4-6

# 或 Dify（对话型应用，后端用 blocking 模式）
API_PROVIDER=dify
DIFY_API_KEY=app-xxxx
DIFY_API_BASE=https://api.dify.ai/v1
```

改完 `.env` 后**重启后端**（`npm run dev` 会自动热重载）。

---

## 四、API 设计

`POST /api/generate`

请求体：

```json
{
  "step": "standard-analysis",
  "input": { "subject": "...", "grade": "...", "standard": "...", "topic": "...", "duration": "...", "studentBase": "...", "difficulty": "..." },
  "draft": { "...前序步骤已生成结果，用于让后续步骤对齐..." }
}
```

返回体（**始终 200，绝不因模型失败而崩溃**）：

```json
{ "success": true, "mode": "mock", "step": "standard-analysis", "data": { "...": "..." }, "fallback": true, "message": "真实模型调用失败，已自动切换演示模式。" }
```

`step` 枚举：`start` / `unit-analysis-report` / `standard-analysis` / `goals` / `evidence` / `task-chain` / `support-quality` / `final-lesson`。
中间步骤返回结构化 JSON；`final-lesson` 返回 `{ "markdown": "..." }`。

`unit-analysis-report` 是单元精准设计的上游专业分析报告，包含：

1. 单元扫描结果；
2. 当前课文深度解读；
3. 儿童起点与理解路径分析；
4. 课堂转化设计；
5. 证据链表；
6. 最终结论。

后续 `goals`、`evidence`、`task-chain`、`support-quality`、`final-lesson` 都会接收这份报告，并回应当前课文在单元中的位置、本课唯一核心抓手、儿童理解障碍、证据链判断性质和递进任务建议。

---

## 五、自动回退与“永不崩溃”策略

满足以下任一条件，自动使用 mock 数据，前端提示**“当前为演示模式，流程可完整体验。”**：

- 没有 API Key；
- `API_PROVIDER=mock`；
- `MOCK_MODE=true`；
- 模型调用失败（网络/超时/非 2XX）；
- 返回不是合法 JSON 或结构异常。

此外，若**后端进程被关闭**（极端演示情况），前端会捕获网络错误并使用内置本地兜底数据继续渲染，同样不会崩溃。

---

## 六、常见问题

- **端口被占用**：改 `.env` 的 `PORT`，并同步修改 `client/vite.config.ts` 里 proxy 的 `target`。
- **前端打不开 / 接口 404**：确认后端已在 `3001` 启动（`npm run dev` 会同时启动；看到 `[server] ... 已启动` 即正常）。
- **想强制真实模型**：把 `MOCK_MODE` 改 `false`、`API_PROVIDER` 改对应值、填好 Key，重启。
- **首次 `npm install` 较慢**：会安装根、client、server 三处依赖。

---

## 七、不做的事（刻意取舍）

暂不做登录、数据库、历史记录、多用户、文件上传、复杂知识库、多主题模板、复杂动画等。
已完成 Markdown、Word、打印/PDF 导出；当前版本优先保证**页面能打开、流程能跑、mock 能演示、最终教案能导出、代码不崩**。

---

## 八、成果导出（Word / PDF）

生成任意一步内容后，右侧预览栏提供 **四个出口**（Word / 打印只要有任意一步成果即可用，不必先点“生成完整教学设计”）：

| 按钮 | 说明 |
| --- | --- |
| 复制 Markdown | 复制完整教案为 Markdown 文本 |
| 下载 .md | 下载 Markdown 文件 |
| **下载 Word** | 用 `docx` 库本地生成 `.docx`（标题居中、分级标题、教学目标编号列表、评价证据/任务链/质量体检为表格）。文件名：`课标到课堂_教学设计_<主题>.docx`（自动从《主题》提取）。**不重新请求 AI**。失败时提示“Word 生成失败，请先使用复制 Markdown 或打印 PDF。” |
| **打印 / 导出 PDF** | 调用 `window.print()`，打印样式自动隐藏导航/按钮/模式提示，仅保留 A4 友好的正文；在打印面板选“另存为 PDF”即可导出 |

- **下载 Word / 打印** 两个按钮在**尚未生成任何一步内容前为禁用状态**（悬停提示“请先生成至少一步内容”）；一旦生成任意一步（含单元定位型文本解读报告）即可导出。
- `docx` 库按需懒加载（动态 import），不增加首屏体积。
- Word/PDF 均基于已生成的结构化结果，**不再调用 AI**，不会影响主流程。

**右下角 AI 引导助手（Dify 悬浮气泡）**：使用 Dify 官方 bubble 脚本（`https://udify.app/embed.min.js`，token `hvtT94ljurxSFeyC`）在页面右下角生成一个常驻悬浮按钮，点击打开对话窗口，供教师在卡住时追问课标拆解、目标定位、评价证据与任务链设计。它全局常驻、不依赖当前步骤；通过 script id 去重，热更新或重复挂载不会出现两个按钮；打印 / 导出 PDF 时自动隐藏，避免污染正文。正式结构化成果仍以六步工作台生成内容为准。若使用 Dify 作为 `/api/generate` 的结构化生成引擎，需要单独配置返回 JSON 的 Dify Workflow。

---

## 九、自检清单（开发完成后逐条确认）

- [x] `npm install` 成功（根 + 前端 + 后端；新增 `docx` 依赖）
- [x] `npm run dev` 成功同时启动前后端
- [x] 前端地址 http://localhost:5173，后端地址 http://localhost:3001
- [x] mock 模式完整跑通六步
- [x] 六步流程都能生成结构化卡片
- [x] 最终 Markdown 可复制 / 下载
- [x] 下载 Word 可用（含标题、分级标题、表格）
- [x] 打印 / 导出 PDF 可打开打印预览（仅正文、A4 友好）
- [x] 未生成任何一步内容时，Word/PDF 导出按钮禁用、不会误触发；生成任意一步即可导出
- [x] API Key 未出现在前端
- [x] API 失败自动回退 mock
- [x] README 写清运行方式

---

## 十、更新记录

- **2026-06-28**
  - Dify 引导助手从“右侧 iframe Tab”改为**右下角悬浮气泡**（官方 bubble 脚本，全局常驻、去重、打印时隐藏），右侧只保留“教学设计预览”。
  - 单元精准模式的“单元定位型文本解读报告”按《小学语文单元定位型文本解读提示词 3.0》落地：分区展示六个部分（单元扫描 / 课文深度解读 / 儿童起点 / 课堂转化 / 证据链表 / 最终结论），并作为上游依据传给后续目标、评价证据、任务链等步骤。
  - **修复导出**：Word / 打印 PDF 不再强制先点“生成完整教学设计”，**生成任意一步内容即可导出**（此前按钮一直灰着，导致“用不了”）。
  - 演示数据整体替换为《暴风雨来临之前》（三年级 ·“奇妙的世界”单元），含完整单元报告及下游六步示例。
  - 新增 GitHub Actions 工作流：推送到 `main` 后自动构建并发布到 `gh-pages`，在线站点自动更新。
