import React from "react";
import { z } from "zod";
import { tool } from "ai";

export const WEATHER_TOOL_NAME = "weather" as const;

export const weatherToolSchema = z.object({
  location: z.string().describe("The location to get the weather for"),
  temperature: z.number(),
});

export type WeatherToolParams = z.infer<typeof weatherToolSchema>;

export type WeatherToolResult = {
  location: string;
  temperature: number;
};

export type WeatherToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: typeof WEATHER_TOOL_NAME;
  args: WeatherToolParams;
  result: WeatherToolResult;
};

export const weatherTool = tool({
  description: "Get the weather in a location",
  parameters: weatherToolSchema,
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});

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
