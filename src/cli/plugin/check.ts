import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { check } from "../../plugin/check";

const command = "check";

const describe = "Check plugin";

const builder = (args: yargs.Argv) =>
  args.option("input", {
    alias: "i",
    describe: "The input plugin zip or manifest file",
    type: "string",
    demandOption: true,
    requiresArg: true,
  });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    await check(args.input);
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
  },
  "experimental",
  "This feature is under early development",
);
