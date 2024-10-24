import { ZipFile } from "yazl";
import streamBuffers from "stream-buffers";
import _debug from "debug";
import { validateContentsZip } from "./zip";
import { PrivateKey } from "./crypto";

const debug = _debug("packer");

const packer = (
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

  const signature = key.sign(contentsZip);
  const id = key.uuid();
  debug(`id : ${id}`);
  return validateContentsZip(contentsZip)
    .then(() => zip(contentsZip, key.exportPublicKey(), signature))
    .then((plugin) => ({
      plugin,
      privateKey,
      id,
    })) as any;
};

export = packer;

/**
 * Create plugin.zip
 */
const zip = (
  contentsZip: Buffer,
  publicKey: Buffer,
  signature: Buffer,
): Promise<Buffer> => {
  debug(`zip(): start`);
  return new Promise((res) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    output.on("finish", () => {
      debug(`zip(): output finish event`);
      res(output.getContents() as any);
    });
    zipFile.outputStream.pipe(output);
    zipFile.addBuffer(contentsZip, "contents.zip");
    zipFile.addBuffer(publicKey, "PUBKEY");
    zipFile.addBuffer(signature, "SIGNATURE");
    zipFile.end(undefined, ((finalSize: number) => {
      debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    }) as any);
  });
};
