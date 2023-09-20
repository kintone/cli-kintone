import type { LogConfigLevel, Logger, Printer } from "../log";
import { logger, StandardLogger } from "../log";

describe("logger", () => {
  const mockDate = new Date(0);
  const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it('should display correct log message when calling logger with "debug" level', () => {
    const message = "This is example message";

    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "debug",
      printer: jest.fn(),
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.debug(message);

    const expectedMessage = new RegExp(
      `\\[${mockDate.toISOString()}] (.*)DEBUG(.*): ${message}`,
    );

    expect(options.printer).toHaveBeenCalledWith(
      expect.stringMatching(expectedMessage),
    );
  });

  it("should display correct log message with multiple line message", () => {
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

  it("should display correct log message corresponding log config level", () => {
    const message = "This is example message";
    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "info",
      printer: jest.fn((text: string) => {
        return true;
      }),
    };

    const standardLogger = new StandardLogger(options);
    standardLogger.setLogConfigLevel("warn");
    standardLogger.debug(message);
    standardLogger.info(message);
    standardLogger.warn(message);
    standardLogger.error(message);
    standardLogger.fatal(message);
  });

  afterAll(() => {
    spy.mockReset();
    spy.mockRestore();
  });
});
