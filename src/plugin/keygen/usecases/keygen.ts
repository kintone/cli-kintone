import { PrivateKey } from "../../core";
import { logger } from "../../../utils/log";
import type { PrivateKeyRepository } from "./interface";

export const keygen: (
  privateKeyDestination: PrivateKeyRepository,
) => Promise<void> = async (privateKeyDestination) => {
  const privateKey = PrivateKey.generateKey();
  logger.debug(`plugin id: ${privateKey.uuid()}`);

  const outputFilePath = await privateKeyDestination.save(privateKey);
  logger.debug(`output: ${outputFilePath}`);
  logger.info(`New private key generated: ${outputFilePath}`);
};
