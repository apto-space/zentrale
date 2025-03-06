import { WeatherToolResult } from "../weather";

export function WeatherToolView({ result }: { result: WeatherToolResult }) {
  return (
    <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🌤️</div>
        <div>
          <div className="font-medium">{result.location}</div>
          <div className="text-sm text-[var(--text-secondary)]">
            {result.temperature}°F
          </div>
        </div>
      </div>
    </div>
  );
}
