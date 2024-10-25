import _debug from "debug";
import { PrivateKey } from "./crypto";
import type { PluginZipInterface } from "./plugin-zip";
import { PluginZip } from "./plugin-zip";
import type { ContentsZipInterface } from "./contents-zip";

const debug = _debug("packer");

const packer = async (
  contentsZip: ContentsZipInterface,
  privateKey?: string,
): Promise<{
  plugin: PluginZipInterface;
  privateKey: string;
  id: string;
}> => {
  let key: PrivateKey;
  if (privateKey) {
    key = PrivateKey.importKey(privateKey);
  } else {
    debug("generating a new key");
    key = PrivateKey.generateKey();
  }

  const id = key.uuid();
  debug(`id : ${id}`);

  const plugin = await PluginZip.build(contentsZip, key);
  return {
    plugin,
    privateKey: key.exportPrivateKey(),
    id,
  };
};

export default packer;
