import type { CommandModule } from "yargs";
import type yargs from "yargs";
import { uploadCommand } from "./upload";
import { initCommand } from "./init";
import { importCommand } from "./import";
import { setStability } from "../stability";

const command = "customize";

const describe = "Commands for kintone JavaScript/CSS customization";

const builder = (args: yargs.Argv) =>
  args
    .command(uploadCommand)
    .command(initCommand)
    .command(importCommand)
    .demandCommand();

const handler = () => {
  /** noop **/
};

export const customizeCommand: CommandModule = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);
