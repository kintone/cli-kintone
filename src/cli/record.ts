import type * as yargs from "yargs";
import { exportCommand } from "./record/export.js";
import { importCommand } from "./record/import.js";
import { deleteCommand } from "./record/delete.js";

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

export const recordCommand: yargs.CommandModule = {
  command,
  describe,
  builder,
  handler,
};
