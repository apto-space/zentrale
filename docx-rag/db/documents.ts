import { createClient } from "edgedb";

export const client = createClient({ instanceName: "zentrale-ai/core" });

export interface Document {
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export async function insertDocument(doc: Document) {
  return await client.query(
    `
    insert Document {
      content := <str>$content,
      embedding := <voyage_embedding>$embedding,
      metadata := <json>$metadata,
    }
  `,
    {
      content: doc.content,
      embedding: doc.embedding,
      metadata: doc.metadata,
    }
  );
}

export async function searchSimilar(query: string, limit: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  return await client.query(
    `
    select Document {
      content,
      metadata,
    } order by .embedding <-> <voyage_embedding>$embedding
    limit <int64>$limit
  `,
    {
      embedding: queryEmbedding,
      limit,
    }
  );
}

async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Implement embedding generation with VoyageAI
  // This is a placeholder that will need to be implemented
  throw new Error("Embedding generation not implemented yet");
}
