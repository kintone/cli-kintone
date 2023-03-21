import yargs from "yargs";
import { recordCommand } from "./record.js";
import packageJson from "../../package.json";
// eslint-disable-next-line file-extension-in-import-ts/file-extension-in-import-ts, node/file-extension-in-import
import { hideBin } from "yargs/helpers";

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .command(recordCommand)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion().argv;
