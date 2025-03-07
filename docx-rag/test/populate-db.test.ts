import { test, expect } from "bun:test";
import { client } from "../db/documents";
import populateDb from "../populate-db";

interface Document {
  content: string;
  metadata: {
    source: string;
    header: string;
    timestamp: string;
  };
}

test("should process and insert a document chunk", async () => {
  // Create a test markdown file
  const testContent = `# Test Document
This is a test document with some content.
## Subsection
More content here.
Some more text.`;

  // Write test content to a temporary file
  const testFilePath = "test.md";
  await Bun.write(testFilePath, testContent);

  try {
    // Get initial document count
    const initialCount =
      (await client.querySingle<number>(`
      select count(Document)
    `)) ?? 0;

    // Process the test file
    await populateDb(testFilePath);

    // Get final document count
    const finalCount =
      (await client.querySingle<number>(`
      select count(Document)
    `)) ?? 0;

    // Verify that documents were inserted
    expect(finalCount).toBeGreaterThan(initialCount);

    // Query the database to verify insertion
    const result = await client.query<Document>(
      `
      select Document {
        content,
        metadata,
      } filter <str>.metadata['source'] = <str>$source
    `,
      {
        source: testFilePath,
      }
    );

    // Verify that documents were inserted
    expect(result.length).toBeGreaterThan(0);

    // Verify the content of the first document
    const firstDoc = result[0];
    expect(firstDoc.content).toContain("# Test Document");
    expect(firstDoc.metadata.source).toBe(testFilePath);
    expect(firstDoc.metadata.header).toBe("# Test Document");

    // Verify the embedding was generated
    const docWithEmbedding = await client.querySingle<
      Document & { embedding: number[] }
    >(
      `
      select Document {
        content,
        metadata,
        embedding,
      } filter <str>.metadata['source'] = <str>$source
      limit 1
    `,
      {
        source: testFilePath,
      }
    );

    if (!docWithEmbedding) {
      throw new Error("Document with embedding not found");
    }
    console.log(
      await client.querySingle<number>(`
      select count(Document)
    `)
    );
    console.log(docWithEmbedding);

    expect(docWithEmbedding.embedding).toBeDefined();
    expect(docWithEmbedding.embedding.length).toBe(1024); // Voyage embeddings are 1024-dimensional
  } finally {
    // Clean up test file
    await Bun.write(testFilePath, "");
  }
});
