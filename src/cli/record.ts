import yargs, { CommandModule } from "yargs";
import { exportCommand } from "./record/export";
import { importCommand } from "./record/import";

const command = "record";

const describe = "import/export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .command(exportCommand)
    .command(importCommand)
    .demandCommand()
    .strict()
    .help();

const handler = () => {
  /** noop **/
};

export const recordCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
