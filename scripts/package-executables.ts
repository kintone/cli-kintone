import { exec } from "@yao-pkg/pkg";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildPkgTargets,
  parseNodeVersion,
} from "./bundled-node/node-version.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

const nodeVersion = parseNodeVersion(
  await fs.readFile(path.join(projectRoot, ".node-version"), "utf8"),
);

await exec([
  "--sea",
  path.join(projectRoot, "dist/index.js"),
  "-o",
  path.join(projectRoot, "bin/cli-kintone"),
  "-t",
  buildPkgTargets(nodeVersion),
]);
