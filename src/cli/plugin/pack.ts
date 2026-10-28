import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { run } from "../../plugin/pack/";

const command = "pack";

const describe = "Packaging plugin project to a zip file";

const builder = (args: yargs.Argv) =>
  args
    .option("input", {
      alias: "i",
      describe: "The input plugin manifest file path.",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("output", {
      alias: "o",
      describe:
        'The destination file path to generate plugin zip file.\nDefault to "./plugin.zip".',
      type: "string",
      default: "plugin.zip",
      requiresArg: true,
    })
    .option("private-key", {
      describe:
        'The path of private key file.\nTo generate private key, use "plugin keygen" command.',
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("watch", {
      describe: "Run in watch mode",
      type: "boolean",
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  const options = {
    input: args.input,
    output: args.output,
    privateKeyPath: args["private-key"],
    watch: args.watch ?? false,
  };
  if (process.env.NODE_ENV === "test") {
    console.log(JSON.stringify(options));
  } else {
    await run(options);
  }
};

export const packCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
