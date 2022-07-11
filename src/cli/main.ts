import yargs from "yargs";
import { recordCommand } from "./record";

// eslint-disable-next-line no-unused-expressions
yargs.command(recordCommand).demandCommand().strict().help().argv;
