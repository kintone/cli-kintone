import path from "path";
import packer from "../index";
import { ManifestFactory } from "../manifest";
import { ContentsZip } from "../contents-zip";
import type { PluginZip } from "../plugin-zip";

// TODO: We can consider deleting this function. Originally, it is used by webpack-plugin-kintone-plugin.
//  In cli-kintone, it is no longer needed.
//  ref. https://github.com/kintone/js-sdk/blob/fb125766efe1b0866dfb50d56a4aa80c1a8f0de8/packages/webpack-plugin-kintone-plugin/src/plugin.ts#L4
//  ref.https://github.com/kintone-labs/plugin-packer/pull/49
/**
 * @deprecated
 */
export const packPluginFromManifest = async (
  manifestJSONPath: string,
  privateKey: string,
): Promise<{ plugin: PluginZip; privateKey: string; id: string }> => {
  const manifest = await ManifestFactory.loadJsonFile(manifestJSONPath);
  const contentsZip = await ContentsZip.createFromManifest(
    path.dirname(manifestJSONPath),
    manifest,
  );
  return packer(contentsZip, privateKey);
};
