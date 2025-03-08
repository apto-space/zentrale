import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { tools } from "../../tools";
import { ChatAppConfig } from "../../ChatAppConfig";

export function createStream(messages: any[], config: ChatAppConfig) {
  // Merge all tool objects into a single object
  const configTools = config.options?.tools?.reduce(
    (acc, toolExport) => ({ ...acc, ...toolExport }),
    {}
  );

  return streamText({
    messages,
    model: anthropic("claude-3-5-haiku-latest"),
    system: config.prompts.system,
    tools: configTools ?? tools,
    maxSteps: 5,
    maxRetries: 3,
  });
}

// Default configuration for the chat application
export const defaultConfig: ChatAppConfig = {
  id: "default-chat",
  name: "AI Assistant",
  prompts: {
    system: "You are a helpful assistant.",
  },
  options: {
    examples: [
      "What is the best way to learn programming?",
      "Can you help me debug my code?",
      "What are some good coding practices?",
      "How do I start a new project?",
    ],
  },
};
