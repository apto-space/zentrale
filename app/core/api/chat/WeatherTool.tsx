import { z } from "zod";

export const weatherToolSchema = z.object({
  location: z.string().describe("The location to get the weather for"),
});

export type WeatherToolParams = z.infer<typeof weatherToolSchema>;

export type WeatherToolResult = {
  location: string;
  temperature: number;
};

export function WeatherToolResult({ result }: { result: WeatherToolResult }) {
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
