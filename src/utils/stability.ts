// NOTE: We can consider using process.emitWarning()

import { logger } from "./log";

export const emitExperimentalWarning = (message: string) => {
  logger.warn(`[Experimental] ${message}`);
};

export const emitDeprecationWarning = (message: string) => {
  logger.warn(`[Deprecated] ${message}`);
};
