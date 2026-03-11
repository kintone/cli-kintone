import yargs from "yargs";
import { recordCommand } from "./record/index.js";
import { pluginCommand } from "./plugin/index.js";
import { customizeCommand } from "./customize/index.js";
import { kintoneCommand } from "./kintone.js";
import packageJson from "../../package.json" with { type: "json" };
import { logHandler, logOptions } from "./logOption.js";

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
  .command(recordCommand)
  .command(pluginCommand)
  .command(customizeCommand)
  .command(kintoneCommand)
  .options(logOptions)
  .middleware(logHandler)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion().argv;
