import { keygen } from "./usecases/keygen";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type Options = {
  output?: string;
};

export const run: (options: Options) => Promise<void> = async (options) => {
  try {
    await keygen(options.output);
  } catch (e) {
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};
