import type winston from "winston";
import { logFormat } from "../log.module";

jest.mock("chalk", () => {
  return {
    stderr: {
      blue: jest.fn().mockImplementation((message: any) => message),
    },
  };
});

describe("Log Module", () => {
  it("should return the correct log format", () => {
    const { logger } = require("../log");
    logger.info("This is info message");

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
