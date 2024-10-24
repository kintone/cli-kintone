import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { packCommand } from "./pack";

const command = "plugin";

const describe = "Operate kintone plugin";

const builder = (args: yargs.Argv) => args.command(packCommand).demandCommand();

const handler = () => {
  /** noop **/
};

export const pluginCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
