import { SearchToolResult } from "../search";

export function SearchToolView({ result }: { result: SearchToolResult }) {
  return (
    <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-2xl">🔍</div>
        <div className="font-medium">{result.query}</div>
      </div>
      <ul className="space-y-1 text-sm">
        {result.facts.map((fact, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-[var(--text-secondary)]">•</span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
