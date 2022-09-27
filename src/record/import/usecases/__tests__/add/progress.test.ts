import { ProgressLogger } from "../../add/progress";
import chalk from "chalk";

const info = chalk.blue("INFO");

describe("ProgressLogger", () => {
  const date = new Date(1664258017505);
  const dateMock = jest
    .spyOn(global, "Date")
    .mockImplementation(() => date as unknown as string);

  afterAll(() => {
    dateMock.mockRestore();
  });

  it("should show progress logs correctly", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
    const progressLogger = new ProgressLogger(5000);
    expect(consoleErrorMock).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(consoleErrorMock).not.toHaveBeenCalled();

    progressLogger.update(2000);
    expect(consoleErrorMock).toHaveBeenCalledTimes(2);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      1,
      `[${date.toISOString()}] ${info}: Imported 1000 of 5000 records`
    );
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      2,
      `[${date.toISOString()}] ${info}: Imported 2000 of 5000 records`
    );

    progressLogger.update(4100);
    expect(consoleErrorMock).toHaveBeenCalledTimes(4);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      3,
      `[${date.toISOString()}] ${info}: Imported 3000 of 5000 records`
    );
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      4,
      `[${date.toISOString()}] ${info}: Imported 4000 of 5000 records`
    );

    progressLogger.done();
    expect(consoleErrorMock).toHaveBeenCalledTimes(5);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      5,
      `[${date.toISOString()}] ${info}: Imported 5000 records successfully`
    );

    consoleErrorMock.mockRestore();
  });

  it("should show progress logs correctly with aborting", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const progressLogger = new ProgressLogger(3000);
    expect(consoleErrorMock).not.toHaveBeenCalled();

    progressLogger.update(100);
    expect(consoleErrorMock).not.toHaveBeenCalled();

    progressLogger.update(2100);
    expect(consoleErrorMock).toHaveBeenCalledTimes(2);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      1,
      `[${date.toISOString()}] ${info}: Imported 1000 of 3000 records`
    );
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      2,
      `[${date.toISOString()}] ${info}: Imported 2000 of 3000 records`
    );

    progressLogger.abort(2500);
    expect(consoleErrorMock).toHaveBeenCalledTimes(3);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      3,
      `[${date.toISOString()}] ${info}: Imported 2500 of 3000 records successfully`
    );

    consoleErrorMock.mockRestore();
  });
});
