import { weatherTool } from "./weather";
import { searchTool } from "./search";
import { tomatoFactSearchTool } from "./tomatoFacts";

export const toolConfig = {
  ...searchTool,
  ...tomatoFactSearchTool,
  ...weatherTool,
};
// for AI
// export const tools = Object.fromEntries(
//   Object.entries(toolConfig).map(([key, value]) => [key, value.aiTool])
// );
export const tools = {};
