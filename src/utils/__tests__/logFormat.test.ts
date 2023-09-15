import winston from "winston";

jest.mock("winston", () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
  };
  const mLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});

type TemplateFunction = (info: winston.Logform.TransformableInfo) => string;

describe.skip("log format", () => {
  let templateFunction: TemplateFunction;
  it("should return the correct log format", () => {
    winston.format.printf = jest
      .fn()
      .mockImplementation((templateFn: TemplateFunction) => {
        templateFunction = templateFn;
      });
    const { logger } = require("../log");
    logger.info("This is info message");

    const info = {
      timestamp: new Date().toISOString(),
      level: "info",
      message: "This is info message",
    };

    expect(templateFunction(info)).toBe(
      `[${info.timestamp}] ${info.level}: ${info.message}`,
    );
  });
});
