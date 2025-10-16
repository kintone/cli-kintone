import { $, cd } from "zx";

import fs from "fs/promises";
import path from "path";
import os from "os";
import { rimraf } from "rimraf";
import { fileURLToPath } from "url";
import packageJson from "../package.json" with { type: "json" };

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

cd(projectRoot);

const executableDir = path.join(projectRoot, "bin");
const licenseFile = path.join(projectRoot, "LICENSE");
const thirdPartyNoticeFile = path.join(projectRoot, "NOTICE");

try {
  await $`test -e ${executableDir}`;
} catch (_e) {
  console.error(
    "Error: The executables of cli-kintone are not found at",
    executableDir,
  );
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

try {
  await $`test -e ${thirdPartyNoticeFile}`;
} catch (_e) {
  console.error("The NOTICE file should exist at", thirdPartyNoticeFile);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

try {
  await $`test -e ${licenseFile}`;
} catch (_e) {
  console.error("Error: The LICENSE file should exist at", licenseFile);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const recipes = [
  {
    type: "linux",
    input: "cli-kintone-linux",
    output: "cli-kintone",
  },
  {
    type: "macos",
    input: "cli-kintone-macos",
    output: "cli-kintone",
  },
  {
    type: "win",
    input: "cli-kintone-win.exe",
    output: "cli-kintone.exe",
  },
];

const artifactsDir = path.join(projectRoot, "artifacts");
await $`mkdir -p ${artifactsDir}`;

const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone"));
cd(tempDir);

for (const recipe of recipes) {
  const assetsDir = `cli-kintone-${recipe.type}`;
  await $`mkdir ${assetsDir}`;

  const input = path.join(projectRoot, "bin", recipe.input);
  const output = path.join(assetsDir, recipe.output);

  await $`cp ${input} ${output}`;
  await $`cp ${licenseFile} ${assetsDir}/LICENSE`;
  await $`cp ${thirdPartyNoticeFile} ${assetsDir}/NOTICE`;

  const zipFile = `cli-kintone_v${packageJson.version}_${recipe.type}.zip`;
  await $`zip -r ${zipFile} ${assetsDir}`;
  await $`cp ${zipFile} ${artifactsDir}`;
}

await rimraf(tempDir);

console.log(`Compressed artifacts are saved to ${artifactsDir}`);
