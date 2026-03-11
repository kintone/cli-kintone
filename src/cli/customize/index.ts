import type { CommandModule } from "yargs";
import type * as yargs from "yargs";
import { applyCommand } from "./apply.js";
import { initCommand } from "./init.js";
import { exportCommand } from "./export.js";

const command = "customize";

const describe = "Commands for kintone JavaScript/CSS customization";

const builder = (args: yargs.Argv) =>
  args
    .command(applyCommand)
    .command(initCommand)
    .command(exportCommand)
    .demandCommand();

const handler = () => {
  /** noop **/
};

export const customizeCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
