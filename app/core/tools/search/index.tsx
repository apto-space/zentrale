import { tool, Tool } from "ai";
import { executeSearch } from "./execute";
import { ToolConfig } from "../ToolConfig";
import {
  SearchToolParamsSchema,
  SearchToolResult,
  SearchToolParams,
  SearchToolResultSchema,
} from "./Schema";
import { SearchToolView } from "./SearchToolView";

const aiTool = tool({
  description: "Search and retrieve relevant documentation",
  parameters: SearchToolParamsSchema,
  execute: executeSearch,
});

const search: ToolConfig<SearchToolParams, SearchToolResult> = {
  // namespace, also used by the LLM to identify the tool
  // only one search tool is supported at a time
  aiTool: aiTool,
  view: SearchToolView,
  outputSchema: SearchToolResultSchema,
  inputSchema: SearchToolParamsSchema,
};
export const searchTool = { search };
