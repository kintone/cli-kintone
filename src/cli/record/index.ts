import type { CommandModule } from "yargs";
import type * as yargs from "yargs";
import { exportCommand } from "./export.js";
import { importCommand } from "./import.js";
import { deleteCommand } from "./delete.js";

const command = "record";

const describe = "import/export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .command(exportCommand)
    .command(importCommand)
    .command(deleteCommand)
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
