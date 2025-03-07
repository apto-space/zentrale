import { readFileSync } from "fs";
import { join } from "path";
import { insertDocument } from "./db/documents";
import { generateEmbedding } from "./lib/voyage";

export default async function populateDb(filePath: string) {
  try {
    // Read the markdown file
    const content = readFileSync(filePath, "utf-8");

    // Split content by markdown headers (lines starting with #)
    const chunks = content
      .split(/(?=^# )/m) // Split at the start of lines beginning with #
      .filter((chunk) => chunk.trim())
      .map((chunk) => chunk.trim());

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
