import type yargs from "yargs";
import type { CommandModule } from "yargs";
import cli from "../../plugin/packer/cli";

const command = "pack";

const describe = "export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .option("private-key", {
      describe:
        "The path of private key file\nIf omitted, new private key will be generated.",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("out", {
      describe:
        "The destination path of generated plugin file\nDefault to plugin.zip on current directory",
      type: "string",
      default: "plugin.zip",
      requiresArg: true,
    })
    .option("input", {
      describe: "The input plugin project directory",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("watch", {
      describe: "run in watch mode",
      type: "boolean",
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  const flags = {
    ppk: args["private-key"],
    out: args.out,
    watch: args.watch,
  };
  if (process.env.NODE_ENV === "test") {
    console.log(JSON.stringify({ pluginDir: args.input, flags: flags }));
  } else {
    await cli(args.input, flags);
  }
};

export const packCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
