import type { CommandModule } from "yargs";
import type * as yargs from "yargs";
import { keygenCommand } from "./keygen.js";
import { packCommand } from "./pack.js";
import { infoCommand } from "./info.js";
import { uploadCommand } from "./upload.js";
import { initCommand } from "./init.js";

const command = "plugin";

const describe = "Commands for kintone plugin";

const builder = (args: yargs.Argv) =>
  args
    .command(infoCommand)
    .command(keygenCommand)
    .command(packCommand)
    .command(uploadCommand)
    .command(initCommand)
    .demandCommand();

const handler = () => {
  /** noop **/
};

export const pluginCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
