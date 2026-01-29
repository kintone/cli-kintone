import { spawnSync } from "child_process";
import type { Lang } from "./lang";
import { getMessage } from "./messages";
import { logger } from "../../../utils/log";

/**
 * Install specified dependencies
 * @param targetDirectory
 * @param lang
 */
export const installDependencies = (
  targetDirectory: string,
  lang: Lang,
): void => {
  logger.info(getMessage(lang, "installDependencies"));
  logger.debug(`targetDirectory: ${targetDirectory}`);

  const result = spawnSync("npm install", {
    cwd: targetDirectory,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    logger.debug("dependency installation failed");
    throw new Error("Installing dependencies were failed");
  }
  logger.info(getMessage(lang, "dependenciesInstalled"));
};
