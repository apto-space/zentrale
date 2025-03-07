import { searchTool } from "./rag";

export const toolConfig = { ...searchTool };
// for AI
export const tools = Object.fromEntries(
  Object.entries(toolConfig).map(([key, value]) => [key, value.aiTool])
);
