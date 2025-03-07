// run pandoc with all the files in the sources directory
// output to their corresponding directory in the output directory
// here is an example command to turn to markdown
// pandoc -o output.md --extract-media=./media  /Users/janwirth/Downloads/User\ Manual\ \(1\).docx
// then call the populate-db.ts script with the right arguments to populate the database

import { readdir, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function processDocument(inputPath: string, outputDir: string) {
  const fileName = inputPath.split("/").pop()?.replace(".docx", "");
  if (!fileName) return;

  const outputPath = join(outputDir, `${fileName}.md`);
  const mediaDir = join(outputDir, "media");

  // Create output directory if it doesn't exist
  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(mediaDir, { recursive: true });

  // Convert docx to markdown using pandoc
  const pandocCmd = `pandoc -o "${outputPath}" --extract-media="${mediaDir}" "${inputPath}"`;
  await execAsync(pandocCmd);

  // Import the populate-db script dynamically
  const { default: populateDb } = await import("./populate-db");
  await populateDb(outputPath);
}

async function main() {
  try {
    const sourcesDir = join(process.cwd(), "sources");
    const outputDir = join(process.cwd(), "output");

    // Create output directory if it doesn't exist
    await mkdir(outputDir, { recursive: true });

    // Get all docx files from sources directory
    const files = await readdir(sourcesDir);
    const docxFiles = files.filter((file) => file.endsWith(".docx"));

    // Process each document
    for (const file of docxFiles) {
      const inputPath = join(sourcesDir, file);
      console.log(`Processing ${file}...`);
      await processDocument(inputPath, outputDir);
      console.log(`Completed processing ${file}`);
    }

    console.log("All documents processed successfully!");
  } catch (error) {
    console.error("Error processing documents:", error);
    process.exit(1);
  }
}

main();
