import type { Logger } from "../../../utils/log";

import { ProgressLogger } from "../../add/progress";

const mockLogger: Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

describe("ProgressLogger", () => {
  it("should show progress logs correctly", () => {
    const progressLogger = new ProgressLogger(mockLogger, 5000);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(2000);
    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "Imported 1000 of 5000 records"
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "Imported 2000 of 5000 records"
    );

    progressLogger.update(4100);
    expect(mockLogger.info).toHaveBeenCalledTimes(4);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      3,
      "Imported 3000 of 5000 records"
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      4,
      "Imported 4000 of 5000 records"
    );

    progressLogger.done();
    expect(mockLogger.info).toHaveBeenCalledTimes(5);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      5,
      "Imported 5000 records successfully"
    );
  });

  it("should show progress logs correctly with aborting", () => {
    const progressLogger = new ProgressLogger(mockLogger, 3000);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(mockLogger.info).not.toHaveBeenCalled();

    progressLogger.update(2100);
    expect(mockLogger.info).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      "Imported 1000 of 3000 records"
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      "Imported 2000 of 3000 records"
    );

    progressLogger.abort(2500);
    expect(mockLogger.info).toHaveBeenCalledTimes(3);
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      3,
      "Imported 2500 of 3000 records successfully"
    );
  });
});
