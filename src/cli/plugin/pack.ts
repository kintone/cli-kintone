import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { emitExperimentalWarning } from "../../utils/stability";
import { run } from "../../plugin/packer/";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";

const command = "pack";

const describe = "[Experimental] Packaging plugin project to a zip file";

const builder = (args: yargs.Argv) =>
  args
    .option("input", {
      describe: "The input plugin project directory",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("output", {
      describe:
        "The destination path of generated plugin file\nDefault to plugin.zip on current directory",
      type: "string",
      default: "plugin.zip",
      requiresArg: true,
    })
    .option("private-key", {
      describe:
        "The path of private key file\nIf omitted, new private key will be generated.",
      type: "string",
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
  try {
    emitExperimentalWarning("This feature is under early development");
    const flags = {
      ppk: args["private-key"],
      output: args.output,
      watch: args.watch,
    };
    if (process.env.NODE_ENV === "test") {
      console.log(JSON.stringify({ pluginDir: args.input, flags: flags }));
    } else {
      await run(args.input, flags);
    }
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const packCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};
