import { NextResponse } from "next/server";
import { z } from "zod";
import { executeSearch } from "~/app/core/tools/search/execute";

const SearchRequestSchema = z.object({
  queries: z.array(
    z.object({
      id: z.string(),
      example: z.string(),
      keywords: z.array(z.string()),
      limit: z.number().optional(),
      relevanceThreshold: z.number().optional(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { queries } = SearchRequestSchema.parse(body);

    const results = await Promise.all(
      queries.map((params) => executeSearch(params))
    );

    return NextResponse.json({
      results: queries.map((query, i) => ({
        id: query.id,
        example: query.example,
        keywords: query.keywords,
        result: results[i],
      })),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
