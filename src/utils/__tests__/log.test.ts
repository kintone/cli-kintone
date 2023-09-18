import type { LoggerModuleInterface, Logger } from "../log";
import { CliKintoneLogger } from "../log";

describe("logger", () => {
  const mockLogModule: LoggerModuleInterface = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    setLogConfigLevel: jest.fn(),
    silent: jest.fn(),
  };

  const logger = new CliKintoneLogger(mockLogModule, "debug");
  const patternTests = ["debug", "info", "warn", "error", "fatal"];

  patternTests.forEach((log) => {
    it(`should call logModule.${log} when logger.${log} is called`, () => {
      logger[log as keyof Logger]("This is an example message.");
      expect(mockLogModule[log as keyof Logger]).toHaveBeenCalledTimes(1);
    });
  });

  it(`should set log config level successfully`, () => {
    logger.setLogConfigLevel("info");
    expect(mockLogModule.setLogConfigLevel).toHaveBeenCalled();
  });

  it(`should silent when the log config level is "none"`, () => {
    logger.setLogConfigLevel("none");
    expect(mockLogModule.silent).toHaveBeenCalled();
  });
});
