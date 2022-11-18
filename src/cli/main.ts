import yargs from "yargs";
import { recordCommand } from "./record";
import { deleteCommand } from "./delete";

// eslint-disable-next-line no-unused-expressions
yargs
  .completion("completion")
  .command(recordCommand)
  .command(deleteCommand)
  .demandCommand()
  .strict()
  .help().argv;
