import path from "path";
import packer from "./index";
import { ManifestV1 } from "./manifest";
import { ContentsZip } from "./contents-zip";

export const packPluginFromManifest = async (
  manifestJSONPath: string,
  privateKey: string,
): Promise<{ plugin: Buffer; privateKey: string; id: string }> => {
  const manifest = await ManifestV1.loadJsonFile(manifestJSONPath);
  const contentsZip = await ContentsZip.createFromManifest(
    path.dirname(manifestJSONPath),
    manifest,
  );
  return packer(contentsZip.buffer, privateKey);
};
