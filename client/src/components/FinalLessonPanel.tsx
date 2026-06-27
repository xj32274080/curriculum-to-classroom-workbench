// Shown in the preview column once a complete plan is generated: a success
// banner plus the full Markdown. Copy/download/reset live in PreviewPanel.

export default function FinalLessonPanel({ markdown }: { markdown: string }) {
  return (
    <>
      <div className="mode-banner" style={{ borderColor: "#bbf0d6", background: "#ecfdf3", color: "#065f46" }}>
        <b>✓ 完整教学设计已生成</b> 目标、评价、活动已对齐，可直接用于课堂或继续修改。
      </div>
      <div className="preview-box">{markdown}</div>
    </>
  );
}
