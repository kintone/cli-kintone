"use strict";

import { spawnSync } from "child_process";
import type { Lang } from "./lang";
import { getMessage } from "./messages";
import { logger } from "../../../utils/log";

/**
 * Install specified dependencies
 * @param outputDirectory
 * @param lang
 */
export const installDependencies = (
  outputDirectory: string,
  lang: Lang,
): void => {
  logger.info(getMessage(lang, "installDependencies"));

  const result = spawnSync("npm", ["install"], {
    cwd: outputDirectory,
    stdio: "inherit",
    // TODO: Consider to remove shell option to avoid security vulnerability
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error("Installing dependencies were failed");
  }
};
