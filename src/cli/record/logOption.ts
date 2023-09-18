import type { Options, CommandModule } from "yargs";
import type { LogConfigLevel } from "../../utils/log";
import { logger, SUPPORTED_LOG_CONFIG_LEVELS } from "../../utils/log";

export const logOptions: { [key: string]: Options } = {
  "log-level": {
    describe: "Log Level",
    default: "info",
    choices: SUPPORTED_LOG_CONFIG_LEVELS,
    requiresArg: true,
  },
  verbose: {
    alias: "v",
    describe: "Verbose mode",
    type: "boolean",
  },
};

export const handler = (args: any) => {
  const logLevel = args["log-level"] as LogConfigLevel;
  const verbose = args.verbose;
  if (verbose) {
    logger.setLogConfigLevel("debug");
    return;
  }

  logger.setLogConfigLevel(logLevel);
};
