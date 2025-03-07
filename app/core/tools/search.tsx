import React from "react";
import { z } from "zod";
import { tool } from "ai";
import { ToolConfig } from "./ToolConfig";

const tomatoFactSearchSchema = z.object({
  query: z.string().describe("The search query"),
  facts: z.array(z.string()),
});

const ParamsSchema = z.object({
  query: z.string().describe("The search query"),
});

type Params = z.infer<typeof ParamsSchema>;
type TomatoFactSearchResult = z.infer<typeof tomatoFactSearchSchema>;

const tomatoFactSearchTool = tool({
  description: "Search for information about tomatoes",
  parameters: ParamsSchema,
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

function TomatoFactSearchView({ result }: { result: TomatoFactSearchResult }) {
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

const tomatoFactSearch: ToolConfig<Params, TomatoFactSearchResult> = {
  aiTool: tomatoFactSearchTool,
  view: TomatoFactSearchView,
  outputSchema: tomatoFactSearchSchema,
};

export const tomatoFactSearchTool = { tomatoFactSearch };
