import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { weatherTool, WEATHER_TOOL_NAME } from "./WeatherTool";

export const aiConfig = {
  model: anthropic("claude-3-5-haiku-latest"),
  system: "You are a helpful assistant.",
  tools: {
    [WEATHER_TOOL_NAME]: weatherTool,
  },
} as const;

export function createStream(messages: any[]) {
  return streamText({
    ...aiConfig,
    messages,
  });
}
