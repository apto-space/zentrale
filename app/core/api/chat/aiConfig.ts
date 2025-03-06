import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { tools } from "../../tools";

export const aiConfig = {
  model: anthropic("claude-3-5-haiku-latest"),
  system: "You are a helpful assistant.",
  tools,
} as const;

export function createStream(messages: any[]) {
  return streamText({
    ...aiConfig,
    messages,
  });
}
