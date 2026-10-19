import { keygen } from "./usecases/keygen";
import { PrivateKeyFileExistsError } from "./usecases/keygen/error";
import { LocalPrivateKeyRepository } from "./repositories/localPrivateKeyRepository";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type Options = {
  output?: string;
};

export const run: (options: Options) => Promise<void> = async (options) => {
  try {
    await keygen(new LocalPrivateKeyRepository(), options.output);
  } catch (e) {
    // Keeps the CLI output "Error: <cause>" for this failure; RunError prints the heading and the cause without the "Error: " prefix.
    logger.error(
      e instanceof PrivateKeyFileExistsError
        ? `Error: ${e.cause}`
        : new RunError(e),
    );
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};
