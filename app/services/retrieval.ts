import { createClient } from "edgedb";

interface Document {
  content: string;
  metadata: any;
  embedding: number[];
  distance: number;
}

export async function retrieveSimilarDocuments(
  userMessage: string,
  limit: number = 10
): Promise<Document[]> {
  const client = createClient();

  // Get the embedding for the user's message
  const embeddingResponse = await fetch(
    "https://api.voyageai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        input: userMessage,
        model: "voyage-2",
      }),
    }
  );

  const embeddingData = await embeddingResponse.json();
  const embedding = embeddingData.data[0].embedding;

  // Query the database for similar documents
  const similarDocs = await client.query<Document>(
    `
    select Document {
      content,
      metadata,
      embedding,
      distance := ext::pgvector::cosine_distance(.embedding, <voyage_embedding>$embedding)
    }
    order by .distance
    limit <int64>$limit
  `,
    {
      embedding: new Float32Array(embedding),
      limit,
    }
  );

  return similarDocs;
}
