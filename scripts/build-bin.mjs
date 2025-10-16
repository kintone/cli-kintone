import { $ } from "zx";
import { copyFile } from "fs/promises";
import path from "path";

$.verbose = true;

// ref. https://nodejs.org/api/single-executable-applications.html

// Generate the blob to be injected
await $`node --experimental-sea-config sea-config.json`;

const targets = [
  { platform: "linux", bin: "cli-kintone-linux" },
  { platform: "macos", bin: "cli-kintone-macos" },
  { platform: "win", bin: "cli-kintone-win.exe" },
];
const binDir = "bin";

for (const target of targets) {
  console.log(`Building the binary for ${target.platform}...`);
  const binPath = path.join(binDir, target.bin);

  // Create a copy of the node executable
  await copyFile(process.execPath, binPath);

  // Remove the signature of the binary (macOS and Windows only)
  if (target.platform === "macos") {
    await $`codesign --remove-signature ${binPath}`;
  }

  // Inject the blob into the copied binary by running postject
  // await inject(binPath, "index.js", "", {});
  await $`postject ${binPath} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA`;

  if (target.platform === "macos") {
    // Re-sign the binary (macOS only)
    await $`codesign --sign - --force --timestamp ${binPath}`;
  }
}
