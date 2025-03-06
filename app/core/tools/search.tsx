import React from "react";
import { z } from "zod";
import { tool } from "ai";

export const SEARCH_TOOL_NAME = "search" as const;

export const searchToolSchema = z.object({
  query: z.string().describe("The search query"),
  facts: z.array(z.string()),
});

export type SearchToolParams = z.infer<typeof searchToolSchema>;

export type SearchToolResult = {
  query: string;
  facts: string[];
};

export type SearchToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: typeof SEARCH_TOOL_NAME;
  args: SearchToolParams;
  result: SearchToolResult;
};

export const searchTool = tool({
  description: "Search for information about a topic",
  parameters: searchToolSchema,
  execute: async ({ query }) => ({
    query,
    facts: [
      "Tomatoes are technically a fruit, not a vegetable",
      "They originated in western South America",
      "The first tomatoes in Europe were yellow, not red",
      "Tomatoes are rich in vitamins C and K",
      "The largest tomato ever grown weighed over 7 pounds",
    ],
  }),
});

export function SearchToolView({ result }: { result: SearchToolResult }) {
  return (
    <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-2xl">🔍</div>
        <div className="font-medium">Search: {result.query}</div>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {result.facts.map((fact, index) => (
          <li key={index} className="text-sm text-[var(--text-secondary)]">
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
