import { CliKintoneLogger } from "../../utils/log";
import { logHandler } from "../record/logOption";

describe("logHandler", () => {
  const patternTests = ["debug", "info", "warn", "error", "fatal"];

  it(`should set "debug" to the log config level when verbose argument is true`, () => {
    // const logger = new CliKintoneLogger(mockLogModule, "debug");
    const spyLogger = jest.spyOn(
      CliKintoneLogger.prototype,
      "setLogConfigLevel",
    );

    logHandler({ $0: "", _: ["123"], verbose: true });
    expect(spyLogger).toHaveBeenCalledTimes(1);
    expect(spyLogger).toHaveBeenCalledWith("debug");
  });

  patternTests.forEach((log) => {
    it(`should set "${log}" to the log config level when log-level argument is "${log}"`, () => {
      const spyLogger = jest.spyOn(
        CliKintoneLogger.prototype,
        "setLogConfigLevel",
      );

      logHandler({ $0: "", _: ["123"], verbose: false, "log-level": "warn" });
      expect(spyLogger).toHaveBeenCalledTimes(1);
      expect(spyLogger).toHaveBeenCalledWith("warn");
    });
  });
});
