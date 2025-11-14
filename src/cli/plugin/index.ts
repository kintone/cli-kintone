import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { keygenCommand } from "./keygen";
import { packCommand } from "./pack";
import { infoCommand } from "./info";
import { uploadCommand } from "./upload";
import { checkCommand } from "./check";
import { setStability } from "../stability";

const command = "plugin";

const describe = "Commands for kintone plugin";

const builder = (args: yargs.Argv) =>
  args
    .command(infoCommand)
    .command(keygenCommand)
    .command(packCommand)
    .command(uploadCommand)
    .command(checkCommand)
    .demandCommand();

const handler = () => {
  /** noop **/
};

export const pluginCommand: CommandModule = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);
