import type { ArgumentsCamelCase, CommandModule } from "yargs";
import {
  emitDeprecationWarning,
  emitExperimentalWarning,
} from "../utils/stability";

/**
 * Set stability index to a command.
 *   - Show stability on help message
 *   - Emit warning on execution
 * @param cmd Command module
 * @param stability "experimental" or "deprecated"
 * @param message additional information
 */
export const setStability = <T = {}, U = {}>(
  cmd: CommandModule<T, U>,
  stability: "experimental" | "deprecated",
  message: string,
): CommandModule<T, U> => {
  const { describe, handler, ...restCmd } = cmd;
  const newDescribe = buildDescriptionWithStability(
    describe,
    message,
    stability,
  );

  const newHandler = async (args: ArgumentsCamelCase<U>) => {
    switch (stability) {
      case "experimental":
        emitExperimentalWarning(message);
        break;
      case "deprecated":
        emitDeprecationWarning(message);
        break;
    }
    await handler(args);
  };

  return {
    ...restCmd,
    describe: newDescribe,
    handler: newHandler,
  };
};

const buildDescriptionWithStability = (
  description: string | false | undefined,
  message: string,
  stability: "experimental" | "deprecated",
): string => {
  const labels = {
    experimental: "Experimental",
    deprecated: "Deprecated",
  };
  const label = labels[stability];
  const msgLines = message.split("\n");

  let output = "";
  if (description) {
    output += description + "\n";
  }

  output += `[${label}: ${msgLines[0]}]`;
  if (msgLines.length > 1) {
    output += `${"\n" + msgLines.slice(1)}`;
  }

  return output;
};
