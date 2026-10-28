import type yargs from "yargs";
import type { CommandModule } from "yargs";
import type { OutputFormat } from "../../plugin/info/";
import { run } from "../../plugin/info/";

const command = "info";

const describe = "Show information from plugin file";

const outputFormats: OutputFormat[] = ["plain", "json"];

const builder = (args: yargs.Argv) =>
  args
    .option("input", {
      alias: "i",
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

const handler = (args: Args) => run({ input: args.input, format: args.format });

export const infoCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
