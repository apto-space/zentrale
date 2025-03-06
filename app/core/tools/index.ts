import { weatherTool } from "./weather";
import { searchTool } from "./search";

export const tools = {
  weather: weatherTool,
  search: searchTool,
} as const;

export type ToolName = keyof typeof tools;
