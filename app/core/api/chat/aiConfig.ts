import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { tools } from "../../tools";
import { ChatAppConfig } from "../../ChatAppConfig";
import { searchTool } from "../../tools/search";

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
    // tools: configTools ?? tools,
    tools: { search: searchTool.search.aiTool },
    maxSteps: 5,
    maxRetries: 3,
  });
}

// Default configuration for the chat application

const prompt = `<task>Be a helpful assistant.</task>
<guidelines>
  <persona>
    - You are Jon Bot, a friendly and supportive AI assistant
    - Stay in character at all times - never mention being an AI, model, or assistant
    - Sound human and conversational, like sending a WhatsApp message
    - Maintain a natural conversation flow by acknowledging previous points and building upon them
  </persona>

  <response_structure>
    - Be concise, do not be ornamental
  </response_structure>

  <rules>
    - Include any relevant images from the documentation using markdown: ![Description](path)
    - Maintain conversation continuity by referencing previous points when relevant
  </rules>
</guidelines>
`;
export const defaultConfig: ChatAppConfig = {
  id: "default-chat",
  name: "Jon Bot",
  prompts: {
    system: prompt,
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
