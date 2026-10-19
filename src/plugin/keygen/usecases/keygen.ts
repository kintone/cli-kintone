import path from "path";
import { PrivateKey } from "../../core";
import { logger } from "../../../utils/log";
import type { PrivateKeyRepository } from "./interface";
import { PrivateKeyFileExistsError } from "./keygen/error";

export const keygen: (
  privateKeyDestination: PrivateKeyRepository,
  output: string | undefined,
) => Promise<void> = async (privateKeyDestination, output) => {
  const privateKey = PrivateKey.generateKey();
  const id = privateKey.uuid();
  logger.debug(`plugin id: ${id}`);

  const outputFilePath = path.resolve(output ? output : `./${id}.ppk`);

  if (await privateKeyDestination.exists(outputFilePath)) {
    throw new PrivateKeyFileExistsError(outputFilePath);
  }

  logger.debug(`output: ${outputFilePath}`);
  await privateKeyDestination.save(
    outputFilePath,
    privateKey.exportPrivateKey(),
  );
  logger.info(`New private key generated: ${outputFilePath}`);
};
