import path from "path";
import packer from "./index";
import { ManifestV1 } from "./manifest";
import { ContentsZip } from "./contents-zip";
import type { PluginZip } from "./plugin-zip";

export const packPluginFromManifest = async (
  manifestJSONPath: string,
  privateKey: string,
): Promise<{ plugin: PluginZip; privateKey: string; id: string }> => {
  const manifest = await ManifestV1.loadJsonFile(manifestJSONPath);
  const contentsZip = await ContentsZip.createFromManifest(
    path.dirname(manifestJSONPath),
    manifest,
  );
  return packer(contentsZip, privateKey);
};
