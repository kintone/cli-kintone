import { CliKintoneLogger, SUPPORTED_LOG_CONFIG_LEVELS } from "../../utils/log";
import { logHandler } from "../record/logOption";

describe("logHandler", () => {
  it(`should set "debug" to the log config level when verbose argument is true`, () => {
    const spyLogger = jest.spyOn(
      CliKintoneLogger.prototype,
      "setLogConfigLevel",
    );

    logHandler({ verbose: true, $0: "", _: [""] });
    expect(spyLogger).toHaveBeenCalledTimes(1);
    expect(spyLogger).toHaveBeenCalledWith("debug");
  });

  SUPPORTED_LOG_CONFIG_LEVELS.forEach((log) => {
    it(`should set "${log}" to the log config level when log-level argument is "${log}"`, () => {
      const spyLogger = jest.spyOn(
        CliKintoneLogger.prototype,
        "setLogConfigLevel",
      );

      logHandler({ "log-level": log, verbose: false, $0: "", _: [""] });
      expect(spyLogger).toHaveBeenCalledTimes(1);
      expect(spyLogger).toHaveBeenCalledWith(log);
    });
  });
});
