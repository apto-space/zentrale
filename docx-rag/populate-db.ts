import { readFileSync } from "fs";
import { join } from "path";
import { insertDocument } from "./db/documents";
import { generateEmbedding } from "./lib/voyage";

function splitIntoChunks(content: string): string[] {
  // Split by any level of markdown headers (lines starting with #)
  const lines = content.split("\n");
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let lastHeaderIndex = -1;
  const overlapLines = 5; // Number of lines to overlap between chunks

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line is a header (starts with #)
    if (line.trim().startsWith("#")) {
      // If we have a current chunk, save it
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join("\n"));

        // Start new chunk with overlap from previous chunk
        currentChunk = [];
        if (lastHeaderIndex >= 0) {
          // Include the last few lines from previous chunk for overlap
          const overlapStart = Math.max(0, lastHeaderIndex - overlapLines);
          currentChunk.push(...lines.slice(overlapStart, lastHeaderIndex + 1));
        }
      }

      currentChunk.push(line);
      lastHeaderIndex = i;
    } else {
      currentChunk.push(line);
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n"));
  }

  return chunks
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

export default async function populateDb(filePath: string) {
  try {
    // Read the markdown file
    const content = readFileSync(filePath, "utf-8");

    // Split content into chunks with overlap
    const chunks = splitIntoChunks(content);

    // Process each chunk
    for (const chunk of chunks) {
      const doc = {
        content: chunk,
        embedding: await generateEmbedding(chunk),
        metadata: {
          source: filePath,
          timestamp: new Date().toISOString(),
          header: chunk.split("\n")[0], // Store the header as metadata
        },
      };

      await insertDocument(doc);
      console.log(
        `Processed chunk: ${chunk.split("\n")[0].substring(0, 50)}...`
      );
    }

    console.log("Database population completed successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
    throw error;
  }
}

// Only run if called directly
if (require.main === module) {
  const filePath = join(process.cwd(), "output.md");
  populateDb(filePath).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
