import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { run } from "../../plugin/keygen";

const command = "keygen";

const describe = "Generate private key for packaging a plugin";

const builder = (args: yargs.Argv) =>
  args.option("output", {
    alias: "o",
    describe: "The output private key file path",
    type: "string",
    defaultDescription: "<plugin_id>.ppk",
    requiresArg: true,
  });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = (args: Args) => run({ output: args.output });

export const keygenCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
