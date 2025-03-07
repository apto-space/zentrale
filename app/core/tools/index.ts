import { weatherTool } from "../api/chat/WeatherTool";
import { searchTool } from "./rag";
import { tomatoFactSearchTool } from "./search";

export const toolConfig = {
  ...searchTool,
  ...tomatoFactSearchTool,
  ...weatherTool,
};
// for AI
export const tools = Object.fromEntries(
  Object.entries(toolConfig).map(([key, value]) => [key, value.aiTool])
);
