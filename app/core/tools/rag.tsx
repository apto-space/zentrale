import React from "react";
import { z, ZodSchema } from "zod";
import { tool, Tool } from "ai";
import { retrieveSimilarDocuments } from "../../services/retrieval";
import { rerankDocuments } from "../../services/reranking";
import { ToolConfig } from "./ToolConfig";

const ragToolSchema = z.object({
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
type RAGToolResult = z.infer<typeof ragToolSchema>;

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

function RAGToolView({ result }: { result: RAGToolResult }) {
  return (
    <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-2xl">📚</div>
        <div className="font-medium">{result.summary}</div>
      </div>
      <div className="space-y-3">
        {result.documents.map((doc, index) => (
          <div key={index} className="text-sm">
            <div className="font-medium mb-1">{doc.metadata.header}</div>
            <div className="text-[var(--text-secondary)]">{doc.content}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">
              Relevance: {(1 - doc.distance).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const search: ToolConfig<Params, RAGToolResult> = {
  // namespace, also used by the LLM to identify the tool
  // only one search tool is supported at a time
  aiTool: aiTool,
  view: RAGToolView,
  outputSchema: ragToolSchema,
};
export const searchTool = { search };
