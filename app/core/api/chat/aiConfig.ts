import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { tools } from "../../tools";

export function createStream(messages: any[]) {
  return streamText({
    messages,
    model: anthropic("claude-3-5-haiku-latest"),
    system: "You are a helpful assistant.",
    tools,
    maxSteps: 5,
    maxRetries: 3,
  });
}
