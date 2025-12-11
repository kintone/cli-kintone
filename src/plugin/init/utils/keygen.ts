import { spawnSync } from "child_process";
import type { Lang } from "./lang";
import { getMessage } from "./messages";
import { logger } from "../../../utils/log";

/**
 * Run npm run keygen to generate private key
 * @param targetDirectory
 * @param lang
 */
export const runKeygen = (targetDirectory: string, lang: Lang): void => {
  logger.info(getMessage(lang, "generatingPrivateKey"));
  logger.debug(`targetDirectory: ${targetDirectory}`);

  const result = spawnSync("npm", ["run", "keygen"], {
    cwd: targetDirectory,
    stdio: "inherit",
    // TODO: Consider to remove shell option to avoid security vulnerability
    shell: true,
  });
  if (result.status !== 0) {
    logger.debug("private key generation failed");
    throw new Error("Generating private key failed");
  }
  logger.info(getMessage(lang, "privateKeyGenerated"));
};
