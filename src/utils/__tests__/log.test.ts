import type { LogConfigLevel, Logger, Printer } from "../log";
import { logger, StandardLogger } from "../log";

describe("logger", () => {
  const mockDate = new Date(0);
  const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it('should display correct log when calling logger with "debug" level', () => {
    const message = "This is example message";
    const message1 = `This is first line message\n This is second line message\n`;
    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "debug",
      printer: jest.fn(),
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.debug(message1);

    const expectedMessage = new RegExp(
      `\\[${mockDate.toISOString()}] (.*)DEBUG(.*): ${message1}`,
    );

    expect(options.printer).toHaveBeenCalledWith(
      expect.stringMatching(expectedMessage),
    );
  });

  afterAll(() => {
    spy.mockReset();
    spy.mockRestore();
  });
});
