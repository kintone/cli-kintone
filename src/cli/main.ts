import yargs from "yargs";
import { recordCommand } from "./record";
import { pluginCommand } from "./plugin";
import packageJson from "../../package.json";
import { logHandler, logOptions } from "./logOption";

// eslint-disable-next-line no-unused-expressions
yargs
  .command(recordCommand)
  // NOTE: Hide the plugin command because it's in very early development.
  .command({ ...pluginCommand, describe: false })
  .options(logOptions)
  .middleware(logHandler)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion().argv;
