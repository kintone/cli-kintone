import winston from "winston";
import type { Logger } from "../log";
import { WinstonLoggerModule, logFormat } from "../log.module";

jest.mock("chalk", () => {
  return {
    stderr: {
      bgRed: jest.fn().mockImplementation((message: any) => message),
      red: jest.fn().mockImplementation((message: any) => message),
      yellow: jest.fn().mockImplementation((message: any) => message),
      blue: jest.fn().mockImplementation((message: any) => message),
      green: jest.fn().mockImplementation((message: any) => message),
    },
  };
});

describe("Log Module", () => {
  describe("WinstonLoggerModule", () => {
    const logger = new WinstonLoggerModule("debug");
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
        const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        expect(logSpy.mock.calls[0][0]).toMatchObject({
          timestamp: expect.stringMatching(isoPattern),
          level: expect.stringMatching(new RegExp(`(.*)${logLevel}(.*)`)),
          message: "This is an example message.",
        });
      },
    );

    it('should return warn, error, fatal log when setting log config level is "warn"', () => {
      logger.setLogConfigLevel("warn");
      const logSpy = jest.spyOn(winston.transports.Console.prototype, "log");

      patternTest.forEach((log) => {
        logger[log[1] as keyof Logger]("This is an example message.");
      });

      expect(logSpy).toHaveBeenCalledTimes(3);
    });
  });

  it("should return the correct log format", () => {
    const firstMessage = "This is the first line of the message";
    const secondMessage = "This is the second line of the message";
    const info: winston.Logform.TransformableInfo = {
      timestamp: new Date().toISOString(),
      level: "info",
      message: `${firstMessage}\n${secondMessage}`,
    };

    expect(logFormat(info)).toBe(
      `[${info.timestamp}] ${info.level.toUpperCase()}: ${firstMessage}\n[${
        info.timestamp
      }] ${info.level.toUpperCase()}: ${secondMessage}`,
    );
  });
});
