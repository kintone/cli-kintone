import winston from "winston";
import type { Logger } from "../log";
import { logger, setLogLevel } from "../log";
import { afterEach } from "node:test";

describe("logger", () => {
  describe("log level", () => {
    const mockDate = new Date(0);
    const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    setLogLevel("debug");

    const patternTest = [
      ["DEBUG", "debug"],
      ["INFO", "info"],
      ["WARN", "warn"],
      ["ERROR", "error"],
      ["FATAL", "fatal"],
    ];

    it.each(patternTest)(
      `should return the %s log base on %s level`,
      (logDisplay, logLevel) => {
        const logSpy = jest.spyOn(winston.transports.Console.prototype, "log");

        logger[logLevel as keyof Logger]("This is an example message.");
        expect(logSpy.mock.calls[0][0]).toMatchObject({
          timestamp: "1970-01-01T00:00:00.000Z",
          level: expect.stringMatching(new RegExp(`(.*)${logDisplay}(.*)`)),
          message: "This is an example message.",
        });
      },
    );

    it('should return warn, error, fatal log when setting log level is "warn"', () => {
      setLogLevel("warn");
      const logSpy = jest.spyOn(winston.transports.Console.prototype, "log");

      patternTest.forEach((log) => {
        logger[log[1] as keyof Logger]("This is an example message.");
      });

      expect(logSpy).toHaveBeenCalledTimes(3);
    });

    afterEach(() => {
      spy.mockReset();
      spy.mockRestore();
    });
  });

  it("should return stderr", () => {
    // todo
  });
});
