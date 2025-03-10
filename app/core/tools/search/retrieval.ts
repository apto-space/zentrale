import { createClient } from "edgedb";

interface Document {
  content: string;
  metadata: any;
  embedding: number[];
  distance: number;
}

export async function retrieveSimilarDocuments({
  example,
  keywords,
}: {
  example: string;

  keywords: string[];
}): Promise<Document[]> {
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
        input: example,
        model: "voyage-2",
      }),
    }
  );

  const embeddingData = await embeddingResponse.json();
  console.log("Embedding data", embeddingData);
  const embedding = embeddingData.data[0].embedding;

  // Query the database for similar documents
  const similarDocs = await client.query<Document>(
    `
    select Document {
      content,
      metadata,
      embedding,
      keywords_matched:= any(.content ilike array_unpack(<array<str>>$keywords)),
      distance := ext::pgvector::cosine_distance(.embedding, <voyage_embedding>$embedding)
    }
    # more keywords = higher score, higher distance = lower score
    order by (if .keywords_matched then 1 else 0) - .distance desc
    limit <int64>$limit
  `,
    {
      embedding: new Float32Array(embedding),
      limit: 10,
      keywords: keywords.map((k) => `%${k}%`),
    }
  );

  return similarDocs;
}
