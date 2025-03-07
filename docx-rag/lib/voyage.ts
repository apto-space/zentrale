import { VoyageAIClient } from "voyageai";

const client = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.VOYAGE_API_KEY) {
    throw new Error("VOYAGE_API_KEY environment variable is not set");
  }

  const response = await client.embed({
    model: "voyage-3-large",
    input: text,
  });

  if (!response.data?.[0]?.embedding) {
    throw new Error("Failed to generate embedding");
  }

  return response.data[0].embedding;
}
