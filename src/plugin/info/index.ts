import { info } from "./usecases/info";
import type { OutputFormat } from "./usecases/info";
import { LocalPluginRepositoryFromZipFile } from "./repositories/localPluginRepositoryFromZipFile";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type { OutputFormat };

export type Options = {
  input: string;
  format: OutputFormat;
};

export const run: (options: Options) => Promise<void> = async (options) => {
  try {
    const output = await info(
      new LocalPluginRepositoryFromZipFile(options.input),
      options.format,
    );
    console.log(output);
  } catch (e) {
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};
