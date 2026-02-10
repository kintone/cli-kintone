import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { applyCommand } from "./apply";
import { initCommand } from "./init";
import { exportCommand } from "./export";

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
