import yargs from "yargs";
import { recordCommand } from "./record";
import packageJson from "../../package.json";
import { logHandler, logOptions } from "./logOption";

// eslint-disable-next-line no-unused-expressions
yargs
  .command(recordCommand)
  .options(logOptions)
  .middleware(logHandler)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion().argv;
