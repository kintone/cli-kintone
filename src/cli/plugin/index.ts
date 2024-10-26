import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { packCommand } from "./pack";
import { emitExperimentalWarning } from "../../utils/stability";
import { infoCommand } from "./info";

const command = "plugin";

const describe = "[Experimental] Commands for kintone plugin";

const builder = (args: yargs.Argv) =>
  args.command(packCommand).command(infoCommand).demandCommand();

const handler = () => {
  emitExperimentalWarning("This feature is under early development");
  /** noop **/
};

export const pluginCommand: CommandModule = {
  command,
  describe,
  builder,
  handler,
};
