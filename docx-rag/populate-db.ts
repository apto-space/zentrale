import { readFileSync } from "fs";
import { join } from "path";
import { insertDocument } from "./db/documents";
import { generateEmbedding } from "./lib/voyage";

async function main() {
  try {
    // Read the output.md file
    const filePath = join(process.cwd(), "output.md");
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
          source: "output.md",
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
    process.exit(1);
  }
}

main();
