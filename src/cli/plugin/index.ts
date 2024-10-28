import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { packCommand } from "./pack";
import { infoCommand } from "./info";
import { setStability } from "../stability";

const command = "plugin";

const describe = "Commands for kintone plugin";

const builder = (args: yargs.Argv) =>
  args.command(infoCommand).command(packCommand).demandCommand();

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
