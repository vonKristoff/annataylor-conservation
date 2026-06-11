import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const publicDir = path.join(__dirname, "public/gallery");
const outputFile = path.join(__dirname, "src", "manifest.js");

// Read all files from public directory
fs.readdir(publicDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Filter out subdirectories if you only want files
  const fileNames = files.filter((file) => {
    const filePath = path.join(publicDir, file);
    return fs.statSync(filePath).isFile();
  });

  // Create the JavaScript array string
  const manifestContent = `// Auto-generated manifest file
const fileManifest = ${JSON.stringify(fileNames, null, 2)};

export default fileManifest;
`;

  // Ensure src directory exists
  const srcDir = path.join(__dirname, "src");
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  // Write to file
  fs.writeFile(outputFile, manifestContent, (err) => {
    if (err) {
      console.error("Error writing manifest file:", err);
    } else {
      console.log(`✅ Manifest generated successfully!`);
      console.log(`📁 Found ${fileNames.length} files`);
      console.log(`📝 Saved to: ${outputFile}`);
    }
  });
});
