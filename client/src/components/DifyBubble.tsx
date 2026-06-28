import { useEffect } from "react";

/**
 * 右下角悬浮 AI 助手（Dify 官方 bubble 脚本）。
 *
 * 设计要点：
 * - 使用 Dify 官方 bubble 脚本（https://udify.app/embed.min.js），不再用 iframe。
 * - 作为全局组件挂在 App 顶层，与当前所在步骤无关，像一个桌面小助手常驻右下角。
 * - 通过 script id（= token）做去重：HMR / React.StrictMode 双调用 / 组件重复挂载
 *   都不会产生第二个 Dify 按钮。
 */

const TOKEN = "hvtT94ljurxSFeyC";
const EMBED_SRC = "https://udify.app/embed.min.js";
const STYLE_ID = "dify-bubble-styles";

/**
 * bubble 按钮与聊天窗的样式覆盖。
 * - 默认笑脸按钮隐藏（视觉由 AIAssistantLauncher 接管），但保留其位置用于聊天窗定位。
 * - 底部留出 5.5rem，避免遮挡“打印 / 导出 PDF”“下载 Word”等关键按钮。
 */
const BUBBLE_STYLES = `
#dify-chatbot-bubble-button {
  opacity: 0 !important;
  pointer-events: none !important;
  bottom: 5.5rem !important;
  right: 1.5rem !important;
  z-index: 9999 !important;
}
#dify-chatbot-bubble-window {
  width: 24rem !important;
  height: 40rem !important;
  z-index: 9999 !important;
}
/* 打印 / 导出 PDF 时隐藏悬浮气泡，避免污染正式成果 */
@media print {
  #dify-chatbot-bubble-button,
  #dify-chatbot-bubble-window {
    display: none !important;
  }
}
`;

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
      inputs?: Record<string, unknown>;
      systemVariables?: Record<string, unknown>;
      userVariables?: Record<string, unknown>;
    };
  }
}

export default function DifyBubble() {
  useEffect(() => {
    // 1. 必须在加载脚本之前设置全局配置。
    window.difyChatbotConfig = {
      token: TOKEN,
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    // 2. 样式只注入一次（脚本创建的元素挂在 body 上，全局生效）。
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = BUBBLE_STYLES;
      document.head.appendChild(style);
    }

    // 3. 脚本只注入一次：以 token 作为 script id，已存在则跳过，
    //    避免热更新或重复挂载时生成多个 Dify 按钮。
    if (document.getElementById(TOKEN)) return;

    const script = document.createElement("script");
    script.id = TOKEN;
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
