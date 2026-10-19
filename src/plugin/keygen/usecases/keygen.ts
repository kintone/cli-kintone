import fs from "fs/promises";
import path from "path";
import { PrivateKey } from "../../core";
import { logger } from "../../../utils/log";
import { isFile } from "../../../utils/file";
import { PrivateKeyFileExistsError } from "./keygen/error";

export const keygen: (output: string | undefined) => Promise<void> = async (
  output,
) => {
  const privateKey = PrivateKey.generateKey();
  const id = privateKey.uuid();
  logger.debug(`plugin id: ${id}`);

  const outputFilePath = path.resolve(output ? output : `./${id}.ppk`);

  if (await isFile(outputFilePath)) {
    throw new PrivateKeyFileExistsError(outputFilePath);
  }

  const outputDir = path.dirname(outputFilePath);
  await fs.mkdir(outputDir, { recursive: true });
  logger.debug(`output: ${outputFilePath}`);

  await fs.writeFile(outputFilePath, privateKey.exportPrivateKey(), "utf8");
  logger.info(`New private key generated: ${outputFilePath}`);
};
