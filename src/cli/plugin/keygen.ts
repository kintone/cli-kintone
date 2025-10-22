import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { keygen } from "../../plugin/keygen";

const command = "keygen";

const describe = "Generate private key for packaging a plugin";

const builder = (args: yargs.Argv) =>
  args.option("output", {
    describe: "The output private key file path",
    type: "string",
    defaultDescription: "<plugin_id>.ppk",
    requiresArg: true,
  });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    await keygen(args.output);
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const keygenCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);
