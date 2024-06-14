import type { LogConfigLevel, LogEventLevel, Printer } from "../log";
import { StandardLogger } from "../log";

describe("StandardLogger", () => {
  const mockDate = new Date(0);
  const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  const patternTest = [
    ["TRACE", "trace"],
    ["DEBUG", "debug"],
    ["INFO", "info"],
    ["WARN", "warn"],
    ["ERROR", "error"],
    ["FATAL", "fatal"],
  ];

  it.each(patternTest)(
    'should display %s message when calling logger with "%s" level',
    (logDisplay, logLevel) => {
      const message = "This is example message";

      const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
        logConfigLevel: logLevel as LogConfigLevel,
        printer: jest.fn(),
      };
      const standardLogger = new StandardLogger(options);
      standardLogger[logLevel as LogEventLevel](message);

      const expectedMessage = new RegExp(
        `\\[${mockDate.toISOString()}] (.*)${logDisplay}(.*): ${message}`,
      );

      expect(options.printer).toHaveBeenCalledWith(
        expect.stringMatching(expectedMessage),
      );
    },
  );

  it("should not display any message when calling logger with 'none' level", () => {
    const message = "This is example message";

    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "none",
      printer: jest.fn(),
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.info(message);

    expect(options.printer).not.toHaveBeenCalled();
  });

  it("should display the correct log message with multiple lines message", () => {
    const firstLineMessage = `This is first line message`;
    const secondLineMessage = `This is second line message`;

    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "info",
      printer: jest.fn(),
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.info(`${firstLineMessage}\n${secondLineMessage}`);

    const expectedMessage = new RegExp(
      `\\[${mockDate.toISOString()}] (.*)INFO(.*): ${firstLineMessage}\n\\[${mockDate.toISOString()}] (.*)INFO(.*): ${secondLineMessage}`,
    );

    expect(options.printer).toHaveBeenCalledWith(
      expect.stringMatching(expectedMessage),
    );
  });

  it("should display the correct log message corresponding to the log config level", () => {
    const message = "This is example message";
    const options: { logConfigLevel?: LogConfigLevel; printer: Printer } = {
      printer: jest.fn(),
    };
    const standardLogger = new StandardLogger(options);
    const formatSpy = jest.spyOn(standardLogger as any, "format");
    standardLogger.setLogConfigLevel("warn");
    standardLogger.trace(message);
    standardLogger.debug(message);
    standardLogger.info(message);
    standardLogger.warn(message);
    standardLogger.error(message);
    standardLogger.fatal(message);

    expect(formatSpy).toHaveBeenCalledTimes(3);
    expect(formatSpy.mock.calls[0][0]).toEqual({ level: "warn", message });
    expect(formatSpy.mock.calls[1][0]).toEqual({ level: "error", message });
    expect(formatSpy.mock.calls[2][0]).toEqual({ level: "fatal", message });
  });

  afterAll(() => {
    spy.mockReset();
    spy.mockRestore();
  });
});
