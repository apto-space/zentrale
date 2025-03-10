import { retrieveSimilarDocuments } from "./retrieval";
import { rerankDocuments } from "./reranking";
import { SearchToolParams, SearchToolResult } from "./Schema";

export async function executeSearch({
  example,
  keywords,
}: SearchToolParams): Promise<SearchToolResult> {
  console.log("Searching for documents", example, keywords);
  try {
    // Retrieve similar documents
    const similarDocs = await retrieveSimilarDocuments({
      example,
      keywords,
    });

    // Rerank the documents
    const relevantDocs = await rerankDocuments(similarDocs, example);

    // Create a summary of found documents
    const summary = `Found ${relevantDocs.length} relevant sources in the documentation.`;
    return {
      documents: relevantDocs,
      summary,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search documents");
  }
}
