import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { emitExperimentalWarning } from "../../utils/stability";
import type { OutputFormat } from "../../plugin/info/";
import { run } from "../../plugin/info/";

const command = "info";

const describe = "[Experimental] Show information from plugin file";

const outputFormats: OutputFormat[] = ["plain", "json"];

const builder = (args: yargs.Argv) =>
  args
    .option("input", {
      describe: "The input plugin zip",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("format", {
      describe: "Format",
      default: "plain" satisfies OutputFormat as OutputFormat,
      choices: outputFormats,
      requiresArg: true,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  emitExperimentalWarning("This feature is under early development");
  await run(args.input, args.format);
};

export const infoCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};