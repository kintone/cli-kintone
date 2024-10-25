import streamBuffers from "stream-buffers";
import { ZipFile } from "yazl";
import _debug from "debug";
import type { PrivateKeyInterface } from "../crypto";

const debug = _debug("plugin-zip");

/**
 * Create plugin.zip
 */
export const zip = async (
  contentsZip: Buffer,
  privateKey: PrivateKeyInterface,
): Promise<Buffer> => {
  const publicKey = privateKey.exportPublicKey();
  const signature = privateKey.sign(contentsZip);

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
