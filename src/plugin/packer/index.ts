import _debug from "debug";
import { PrivateKey } from "./crypto";
import type { PluginZipInterface } from "./plugin-zip";
import { PluginZip } from "./plugin-zip";
import type { ContentsZipInterface } from "./contents-zip";

const debug = _debug("packer");

const packer = async (
  contentsZip: ContentsZipInterface,
  privateKey_?: string,
): Promise<{
  plugin: PluginZipInterface;
  privateKey: string;
  id: string;
}> => {
  let privateKey = privateKey_;
  let key;
  if (privateKey) {
    key = PrivateKey.importKey(privateKey);
  } else {
    debug("generating a new key");
    key = PrivateKey.generateKey();
    privateKey = key.exportPrivateKey();
  }

  const id = key.uuid();
  debug(`id : ${id}`);

  const plugin = await PluginZip.build(contentsZip, key);
  return {
    plugin,
    privateKey,
    id,
  };
};

export default packer;
