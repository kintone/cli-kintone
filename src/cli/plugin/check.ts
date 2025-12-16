import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { check } from "../../plugin/check";
import type { OutputFormat } from "../../plugin/info";

const command = "check";

const describe = "Check plugin";

const outputFormats: OutputFormat[] = ["plain", "json"];

const builder = (args: yargs.Argv) =>
  args
    .option("input", {
      alias: "i",
      describe: "The input plugin zip or manifest file",
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
  try {
    await check(args.input, args.format);
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const checkCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
    hidden: true,
  },
  "experimental",
  "This feature is under early development",
);
