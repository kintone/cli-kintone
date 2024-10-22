// NOTE: We can consider using process.emitWarning()

import { logger as defaultLogger } from "./log";

export const emitExperimentalWarning = (
  message: string,
  logger = defaultLogger,
) => {
  logger.warn(`[Experimental] ${message}`);
};

export const emitDeprecationWarning = (
  message: string,
  logger = defaultLogger,
) => {
  logger.warn(`[Deprecated] ${message}`);
};
