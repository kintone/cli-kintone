import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { exportCommand } from "./record/export";
import { importCommand } from "./record/import";
import { deleteCommand } from "./record/delete";
import { logOptions } from "./record/logOption";
import { SUPPORTED_LOG_CONFIG_LEVELS } from "../utils/log";

const command = "record";

const describe = "import/export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .command(exportCommand)
    .command(importCommand)
    .command(deleteCommand)
    .options({
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
    })
    .demandCommand();

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = (args: Args) => {
  console.log("@@@@", args);
  /** noop **/
};

export const recordCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
