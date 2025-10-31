import fs from "fs/promises";
import { PrivateKey } from "../core";
import path from "path";
import { logger } from "../../utils/log";
import { isFile } from "../../utils/file";

export const keygen = async (output?: string) => {
  // Generate new ppk
  const privateKey = PrivateKey.generateKey();
  const id = privateKey.uuid();
  logger.debug(`plugin id: ${id}`);

  // Write out ppk to filesystem
  const outputFilePath = path.resolve(output ? output : `./${id}.ppk`);

  if (await isFile(outputFilePath)) {
    throw new Error(`File ${outputFilePath} already exists.`);
  }

  const outputDir = path.dirname(outputFilePath);
  await fs.mkdir(outputDir, { recursive: true });
  logger.debug(`output: ${outputFilePath}`);

  await fs.writeFile(outputFilePath, privateKey.exportPrivateKey(), "utf8");
  logger.info(`New private key generated: ${outputFilePath}`);
};
