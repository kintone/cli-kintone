import fs from "fs";
import path from "path";
import packer from "./index";
import { createContentsZip } from "./create-contents-zip";

export const packPluginFromManifest = async (
  manifestJSONPath: string,
  privateKey: string,
): Promise<{ plugin: Buffer; privateKey: string; id: string }> => {
  const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
  const buffer = await createContentsZip(
    path.dirname(manifestJSONPath),
    manifest,
  );
  return packer(buffer as any, privateKey);
};
