import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Count markdown/mdx files recursively in a directory
 */
const countFiles = (dir: string): number => {
  let count = 0;

  const walk = (path: string) => {
    try {
      const entries = readdirSync(path, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(path, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.match(/\.(md|mdx)$/)) {
          count++;
        }
      }
    } catch (_) {
      // Directory doesn't exist or can't be read
    }
  };

  walk(dir);
  return count;
};

// Count total English documentation files
const totalDocs = countFiles("docs");

// Count translated Japanese documentation files
const translatedDocs = countFiles(
  "i18n/ja/docusaurus-plugin-content-docs/current",
);

// Calculate translation percentage
const percentage = Math.round((translatedDocs / totalDocs) * 100);

console.log("Translation Progress:");
console.log(`  English docs: ${totalDocs}`);
console.log(`  Japanese docs: ${translatedDocs}`);
console.log(`  Progress: ${percentage}%`);

// Update docusaurus.config.ts
const configPath = "docusaurus.config.ts";
const config = readFileSync(configPath, "utf-8");

// Update the Japanese locale label with the percentage
const updatedConfig = config.replace(
  /(ja:\s*{\s*label:\s*")日本語[^"]*(")/,
  `$1日本語 (${percentage}%)$2`,
);

if (config !== updatedConfig) {
  writeFileSync(configPath, updatedConfig);
  console.log(`\n✓ Updated docusaurus.config.ts: 日本語 (${percentage}%)`);
} else {
  console.log("\n✓ No changes needed in docusaurus.config.ts");
}
