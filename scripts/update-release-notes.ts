import { argv } from "zx";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { parseNodeVersion } from "./bundled-node/node-version.ts";
import { upsertBundledNodeSection } from "./bundled-node/release-notes.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

const notesFile = argv._[0];
if (typeof notesFile !== "string") {
  throw new Error("Usage: zx ./scripts/update-release-notes.ts <notes-file>");
}

const nodeVersion = parseNodeVersion(
  await fs.readFile(path.join(projectRoot, ".node-version"), "utf8"),
);
const notes = await fs.readFile(notesFile, "utf8");
await fs.writeFile(notesFile, upsertBundledNodeSection(notes, nodeVersion));
