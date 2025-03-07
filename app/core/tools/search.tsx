import React from "react";
import { z } from "zod";
import { tool } from "ai";

export const TOMATO_FACT_SEARCH_TOOL_NAME = "tomatoFactSearch" as const;

export const tomatoFactSearchToolSchema = z.object({
  query: z.string().describe("The search query"),
  facts: z.array(z.string()),
});

export type TomatoFactSearchToolParams = z.infer<
  typeof tomatoFactSearchToolSchema
>;

export type TomatoFactSearchToolResult = {
  query: string;
  facts: string[];
};

export type TomatoFactSearchToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: typeof TOMATO_FACT_SEARCH_TOOL_NAME;
  args: TomatoFactSearchToolParams;
  result: TomatoFactSearchToolResult;
};

export const tomatoFactSearchTool = tool({
  description: "Search for information about tomatoes",
  parameters: tomatoFactSearchToolSchema,
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

export function TomatoFactSearchToolView({
  result,
}: {
  result: TomatoFactSearchToolResult;
}) {
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

export const tomatoFactSearchToolConfig = {
  tomatoFactSearch: {
    aiTool: tomatoFactSearchTool,
    view: TomatoFactSearchToolView,
    schema: tomatoFactSearchToolSchema,
  },
};
