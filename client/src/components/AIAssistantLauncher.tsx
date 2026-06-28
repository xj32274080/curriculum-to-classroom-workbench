import { useCallback } from "react";

/**
 * 自定义 AI 助手浮动入口（替代 Dify 默认笑脸按钮）。
 *
 * - 视觉：圆形渐变按钮 + sparkle 图标，配色与工作台一致；hover 显示“AI小老师”。
 * - 交互：点击转发到被隐藏的 Dify 原生按钮（#dify-chatbot-bubble-button），
 *   复用其打开/关闭聊天窗的逻辑——不改 token、不改接入、不改聊天窗功能。
 * - Dify 原生笑脸由 DifyBubble 注入的 CSS 隐藏（opacity:0 / pointer-events:none），
 *   仅保留其位置用于聊天窗定位。
 * - 打印时隐藏（见 styles.css 的 @media print）。
 */
export default function AIAssistantLauncher() {
  const handleClick = useCallback(() => {
    // 复用 Dify 原生按钮的 toggle：首次点击打开聊天窗，再次点击关闭。
    const native = document.getElementById("dify-chatbot-bubble-button");
    if (native) {
      native.click();
    }
  }, []);

  return (
    <button type="button" className="ai-launcher" onClick={handleClick} aria-label="AI小老师">
      <svg className="ai-launcher__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
        <path d="M18.5 1.5L19.5 4.3L22 5L19.5 5.7L18.5 8.5L17.5 5.7L15 5L17.5 4.3Z" />
      </svg>
      <span className="ai-launcher__tip">AI小老师</span>
    </button>
  );
}
