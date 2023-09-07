import type { Logger } from "../log";
import { logger } from "../log";

describe("logger", () => {
  const mockDate = new Date(0);
  const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  const patternTest = [
    ["DEBUG", "debug"],
    ["INFO", "info"],
    ["WARN", "warn"],
    ["ERROR", "error"],
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
        expect.stringMatching(
          new RegExp(
            `\\[1970-01-01T00:00:00.000Z] (.*)${logDisplay}(.*): This is an example message.`,
          ),
        ),
      );
    },
  );

  afterAll(() => {
    spy.mockReset();
    spy.mockRestore();
  });
});
