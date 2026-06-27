import type { QualityItem } from "../types";

function statusClass(status: QualityItem["status"]): string {
  if (status === "需优化") return "opt";
  if (status === "风险") return "risk";
  return "";
}

export default function QualityCheckPanel({ items }: { items: QualityItem[] }) {
  return (
    <div className="quality-grid">
      {items.map((q) => (
        <div className="q-card" key={q.dimension}>
          <div className="q-top">
            <span className="q-title">{q.dimension}</span>
            <span className={`status ${statusClass(q.status)}`}>{q.status}</span>
          </div>
          <p>
            <b>说明：</b>
            {q.comment}
          </p>
          <p>
            <b>建议：</b>
            {q.suggestion}
          </p>
        </div>
      ))}
    </div>
  );
}
