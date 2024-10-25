import _debug from "debug";
import { PrivateKey } from "./crypto";
import { zip } from "./plugin-zip";

const debug = _debug("packer");

const packer = async (
  contentsZip: Buffer,
  privateKey_?: string,
): Promise<{
  plugin: Buffer;
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

  const plugin = await zip(contentsZip, key);
  return {
    plugin,
    privateKey,
    id,
  };
};

export default packer;
