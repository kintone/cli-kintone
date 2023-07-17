import yargs from "yargs";
import { recordCommand } from "./record";
import packageJson from "../../package.json";

// eslint-disable-next-line no-unused-expressions
yargs
  .command(recordCommand)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion().argv;

// This is nothing comment
