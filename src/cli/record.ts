import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { exportCommand } from "./record/export";
import { importCommand } from "./record/import";
import { deleteCommand } from "./record/delete";
import { logOptions, handler as logHandler } from "./record/logOption";

const command = "record";

const describe = "import/export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .command(exportCommand)
    .command(importCommand)
    .command(deleteCommand)
    .options(logOptions)
    .middleware(logHandler)
    .demandCommand();

const handler = () => {
  /** noop **/
};

export const recordCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
