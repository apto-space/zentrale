import { CohereClient } from "cohere-ai";

interface Document {
  content: string;
  metadata: any;
  embedding: number[];
  distance: number;
}

interface RerankedDocument {
  content: string;
  metadata: any;
  distance: number;
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function rerankDocuments(
  documents: Document[],
  query: string,
  topN: number = 5,
  relevanceThreshold: number = 0.2
): Promise<RerankedDocument[]> {
  // Rerank the documents using Cohere
  const reranked = await cohere.rerank({
    documents: documents.map((doc) => doc.content),
    query,
    returnDocuments: true,
    topN,
  });

  // Filter and map the reranked results
  const relevantDocs = reranked.results
    .filter((result) => result.relevanceScore > relevanceThreshold)
    .map((result) => {
      const originalDoc = documents.find(
        (doc) => doc.content === result.document?.text
      );
      return {
        content: result.document?.text || "",
        metadata: originalDoc?.metadata || {},
        distance: result.relevanceScore,
      };
    });

  return relevantDocs;
}
