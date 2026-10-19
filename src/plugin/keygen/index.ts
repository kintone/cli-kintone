import { keygen } from "./usecases/keygen";
import { PrivateKeyFileExistsError } from "./usecases/keygen/error";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type Options = {
  output?: string;
};

export const run: (options: Options) => Promise<void> = async (options) => {
  try {
    await keygen(options.output);
  } catch (e) {
    // Keeps the CLI output "Error: <message>" for this failure; RunError prints the message without the "Error: " prefix.
    logger.error(
      e instanceof PrivateKeyFileExistsError
        ? `Error: ${e.message}`
        : new RunError(e),
    );
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};
