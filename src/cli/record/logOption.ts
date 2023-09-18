import type { Options, CommandModule } from "yargs";
import type { LogConfigLevel } from "../../utils/log";
import { logger, SUPPORTED_LOG_CONFIG_LEVELS } from "../../utils/log";
import type yargs from "yargs";

export const logOptions: { [key: string]: Options } = {
  "log-level": {
    describe: "Log Level",
    default: "info",
    choices: SUPPORTED_LOG_CONFIG_LEVELS,
    requiresArg: true,
  },
  verbose: {
    describe: "Verbose mode",
    type: "boolean",
  },
};

// const builder = (args: yargs.Argv) => {
//   console.log("@@@@", args);
//   args.options({
//     "log-level": {
//       describe: "Log Level",
//       default: "info",
//       choices: SUPPORTED_LOG_CONFIG_LEVELS,
//       requiresArg: true,
//     },
//     verbose: {
//       describe: "Verbose mode",
//       type: "boolean",
//     },
//   });
// };

// type Args = yargs.Arguments<
//   ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
// >;
//
// const handler = (args: Args) => {
//   const logLevel = args["log-level"] as LogConfigLevel;
//   const verbose = args.verbose;
//   if (verbose) {
//     logger.setLogConfigLevel("debug");
//     return;
//   }
//
//   logger.setLogConfigLevel(logLevel);
// };
//
// export const logOption: CommandModule<{}, Args> = {
//   handler,
//   builder,
// };
