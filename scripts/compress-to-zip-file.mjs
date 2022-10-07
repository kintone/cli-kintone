import { $, cd } from "zx";

import fs from "fs/promises";
import path from "path";
import os from "os";
import rimraf from "rimraf";
import { promisify } from "util";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

cd(projectRoot);

const licenseFile = path.join(projectRoot, "LICENSE");
const thirdPartyNoticeFile = path.join(projectRoot, ".licenses", "NOTICE");

try {
  await $`test -e ${licenseFile}`;
} catch (e) {
  console.log("LICENSE file is missing");
  console.log(licenseFile);
}

try {
  await $`test -e ${thirdPartyNoticeFile}`;
} catch (e) {
  console.log("NOTICE file is missing");
  console.log(thirdPartyNoticeFile);
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

  const input = `${projectRoot}/bin/${recipe.input}`;
  const output = `${assetsDir}/${recipe.output}`;

  await $`cp ${input} ${output}`;
  await $`cp ${licenseFile} ${assetsDir}/LICENSE`;
  await $`cp ${thirdPartyNoticeFile} ${assetsDir}/NOTICE`;

  const zipFile = `cli-kintone-${recipe.type}.zip`;
  await $`zip -r ${zipFile} ${assetsDir}`;
  await $`cp ${zipFile} ${artifactsDir}`;
}

await promisify(rimraf)(tempDir);

console.log(`Compressed artifacts are saved to ${artifactsDir}`);
