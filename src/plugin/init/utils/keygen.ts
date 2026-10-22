import { spawnSync } from "child_process";
import { getMessage } from "./messages";
import { logger } from "../../../utils/log";

/**
 * Run npm run keygen to generate private key
 * @param targetDirectory
 */
export const runKeygen = (targetDirectory: string): void => {
  logger.info(getMessage("generatingPrivateKey"));
  logger.debug(`targetDirectory: ${targetDirectory}`);

  const result = spawnSync("npm run keygen", {
    cwd: targetDirectory,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    logger.debug("private key generation failed");
    throw new Error("Generating private key failed");
  }
  logger.info(getMessage("privateKeyGenerated"));
};
