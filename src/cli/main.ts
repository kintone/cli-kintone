import yargs from "yargs";
import { recordCommand } from "./record";

// eslint-disable-next-line no-unused-expressions
yargs.completion('completion').command(recordCommand).demandCommand().strict().help().argv;
