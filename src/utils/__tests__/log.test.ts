import type { Logger } from "../log";
import { logger } from "../log";

describe("logger", () => {
  const patternTest = [
    ["INFO", "info"],
    ["WARN", "warn"],
    ["ERROR", "error"],
    ["DEBUG", "debug"],
    ["FATAL", "fatal"],
  ];
  it.each(patternTest)(
    `should show the %s log when calling logger with %s level`,
    (logDisplay, logLevel) => {
      const consoleMock = jest
        .spyOn(console, "error")
        .mockImplementation(() => {
          return true;
        });

      logger[logLevel as keyof Logger]("This is an example message.");

      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringMatching(`${logDisplay}(.*) This is an example message.`),
      );
    },
  );
});
