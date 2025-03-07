import React from "react";
import { z } from "zod";
import { tool } from "ai";
import { ToolConfig } from "./ToolConfig";

const weatherSchema = z.object({
  location: z.string().describe("The location to get the weather for"),
  temperature: z.number(),
});

const ParamsSchema = z.object({
  location: z.string().describe("The location to get the weather for"),
});

type Params = z.infer<typeof ParamsSchema>;
type WeatherResult = z.infer<typeof weatherSchema>;

const aiTool = tool({
  description: "Get the weather in a location",
  parameters: ParamsSchema,
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});

function WeatherView({ result }: { result: WeatherResult }) {
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

const weather: ToolConfig<Params, WeatherResult> = {
  aiTool,
  view: WeatherView,
  outputSchema: weatherSchema,
};

export const weatherTool = { weather };
