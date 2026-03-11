import type { ContentsZip } from "../contents/index.js";
import { logger } from "../../../utils/log.js";
import yazl from "yazl";
import consumers from "node:stream/consumers";
import type { PrivateKeyInterface } from "../crypto/index.js";

/**
 * Build a zipped plugin
 */
export const buildPluginZip = async (
  contentsZip: ContentsZip,
  privateKey: PrivateKeyInterface,
): Promise<Buffer> => {
  const publicKey = privateKey.exportPublicKey();
  const signature = privateKey.sign(contentsZip.buffer);

  logger.trace(`zip(): start`);
  const zipFile = new yazl.ZipFile();
  zipFile.addBuffer(contentsZip.buffer, "contents.zip");
  zipFile.addBuffer(publicKey, "PUBKEY");
  zipFile.addBuffer(signature, "SIGNATURE");
  zipFile.end(undefined, ((finalSize: number) => {
    logger.trace(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
  }) as any);

  const contents = await consumers.buffer(zipFile.outputStream);

  logger.trace(`zip(): output finish event`);
  return contents;
};
