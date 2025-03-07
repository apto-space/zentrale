import React from "react";
import { z, ZodSchema } from "zod";
import { tool, Tool } from "ai";
import { retrieveSimilarDocuments } from "../../services/retrieval";
import { rerankDocuments } from "../../services/reranking";
import { ToolConfig } from "./ToolConfig";

const searchToolSchema = z.object({
  documents: z.array(
    z.object({
      content: z.string(),
      metadata: z.object({ header: z.string() }).passthrough(),
      distance: z.number(),
    })
  ),
  summary: z.string(),
});

const ParamsSchema = z.object({
  query: z.string().describe("The search query"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of documents to retrieve"),
  relevanceThreshold: z
    .number()
    .optional()
    .describe("Minimum relevance score threshold"),
});
type Params = z.infer<typeof ParamsSchema>;
type SearchToolResult = z.infer<typeof searchToolSchema>;

const aiTool = tool({
  description: "Search and retrieve relevant documentation",
  parameters: ParamsSchema,
  execute: async ({ query, limit = 10, relevanceThreshold = 0.2 }) => {
    // Retrieve similar documents
    const similarDocs = await retrieveSimilarDocuments(query, limit);

    // Rerank the documents
    const relevantDocs = await rerankDocuments(
      similarDocs,
      query,
      limit,
      relevanceThreshold
    );

    // Create a summary of found documents
    const summary = `Found ${relevantDocs.length} relevant sources in the documentation.`;

    return {
      documents: relevantDocs,
      summary,
    };
  },
});

function SearchToolView({ result }: { result: SearchToolResult }) {
  return (
    <div className="bg-[var(--background)] p-1.5 rounded-lg border border-[var(--card-border)]">
      <div className="flex items-center gap-1.5">
        <div className="text-lg">📚</div>
        <div className="text-sm text-[var(--text-secondary)]">
          {result.documents.length} sources found
        </div>
      </div>
    </div>
  );
}
const search: ToolConfig<Params, SearchToolResult> = {
  // namespace, also used by the LLM to identify the tool
  // only one search tool is supported at a time
  aiTool: aiTool,
  view: SearchToolView,
  outputSchema: searchToolSchema,
  inputSchema: ParamsSchema,
};
export const searchTool = { search };
