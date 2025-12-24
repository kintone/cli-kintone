import { vi } from "vitest";
import type { Logger } from "../../../../../utils/log";

import { ProgressLogger } from "../../add/progress";

const mockLogger: Logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn(),
};

describe("ProgressLogger", () => {
  it("should show progress logs correctly", () => {
    const progressLogger = new ProgressLogger(mockLogger, 5000, 2000);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(2000);
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "Imported 2000 of 5000 records",
    );

    progressLogger.update(4100);
    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "Imported 4000 of 5000 records",
    );

    progressLogger.done();
    expect(mockLogger.info).toHaveBeenCalledTimes(3);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      3,
      "Imported 5000 records successfully",
    );
  });

  it("should show progress logs correctly with aborting", () => {
    const progressLogger = new ProgressLogger(mockLogger, 3000, 2000);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(2100);
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "Imported 2000 of 3000 records",
    );

    progressLogger.abort(2500);
    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "Imported 2500 of 3000 records successfully",
    );
  });
});
