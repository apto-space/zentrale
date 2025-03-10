import { z } from "zod";

export const SearchToolResultSchema = z.object({
  documents: z.array(
    z.object({
      content: z.string(),
      metadata: z.object({ header: z.string() }).passthrough(),
      distance: z.number(),
    })
  ),
  summary: z.string(),
});
export const SearchToolParamsSchema = z.object({
  example: z
    .string()
    .describe(
      "An example of the result to be found. We search by example to improve the matches in the documents"
    ),
  keywords: z
    .array(z.string())
    .describe("Keywords to search for in the documentation"),
});
export type SearchToolParams = z.infer<typeof SearchToolParamsSchema>;
export type SearchToolResult = z.infer<typeof SearchToolResultSchema>;
