import type { Arguments, Options } from "yargs";
import type { LogConfigLevel } from "../utils/log";
import { logger, LOG_CONFIG_LEVELS } from "../utils/log";

export const logOptions: { [key: string]: Options } = {
  "log-level": {
    describe: "The log config level",
    default: "info",
    choices: LOG_CONFIG_LEVELS,
    requiresArg: true,
  },
  verbose: {
    describe: 'Set log config level to "debug"',
    type: "boolean",
  },
};

type LogArguments = Arguments & {
  verbose?: boolean;
  "log-level"?: LogConfigLevel;
};

export const logHandler = (args: LogArguments) => {
  const verbose = args.verbose;
  if (verbose) {
    logger.setLogConfigLevel("debug");
    return;
  }

  if (args["log-level"]) {
    logger.setLogConfigLevel(args["log-level"]);
  }
};
