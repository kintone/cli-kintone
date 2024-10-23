// NOTE: We don't use process.emitWarning() for display consistency with our own logger,

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
