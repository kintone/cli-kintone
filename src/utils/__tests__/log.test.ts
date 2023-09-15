import type { LoggerModuleInterface } from "../log";
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

  const logger = new CliKintoneLogger("info", mockLogModule);

  it(`should silent when the log config level is "none"`, () => {
    logger.setLogConfigLevel("none");
    expect(mockLogModule.silent).toHaveBeenCalled();
  });
});
