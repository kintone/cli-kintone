import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { pack } from "../../plugin/packer/";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";

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
        "The destination file path to generate plugin zip file.\nDefault to `./plugin.zip`.",
      type: "string",
      default: "plugin.zip",
      requiresArg: true,
    })
    .option("private-key", {
      describe: "The path of private key file.",
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
  try {
    const params = {
      input: args.input,
      output: args.output,
      ppkFilePath: args["private-key"],
      watch: args.watch,
    };
    if (process.env.NODE_ENV === "test") {
      console.log(JSON.stringify(params));
    } else {
      await pack(params);
    }
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const packCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);
