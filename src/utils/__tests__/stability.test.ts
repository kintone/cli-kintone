import { StandardLogger } from "../log";
import { emitDeprecationWarning, emitExperimentalWarning } from "../stability";

describe("stability", () => {
  const mockDate = new Date(0);
  const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  afterAll(() => {
    spy.mockReset();
    spy.mockRestore();
  });

  describe("emitExperimentalWarning", () => {
    it("should emit experimental warning message", () => {
      const message = "This feature is under development.";

      const printer = jest.fn();
      const logger = new StandardLogger({
        logConfigLevel: "info",
        printer: printer,
      });
      emitExperimentalWarning(message, logger);

      const expectedMessage = new RegExp(
        `\\[${mockDate.toISOString()}] (.*)WARN(.*): \\[Experimental] This feature is under development.`,
      );

      expect(printer).toHaveBeenCalledWith(
        expect.stringMatching(expectedMessage),
      );
    });
  });

  describe("emitDeprecationWarning", () => {
    it("should emit deprecation warning message", () => {
      const message =
        "This feature has been deprecated.\nUse alternative feature instead.";

      const printer = jest.fn();
      const logger = new StandardLogger({
        logConfigLevel: "info",
        printer: printer,
      });
      emitDeprecationWarning(message, logger);

      const expectedMessage = new RegExp(
        `\\[${mockDate.toISOString()}] (.*)WARN(.*): \\[Deprecated] This feature has been deprecated.\n` +
          `\\[${mockDate.toISOString()}] (.*)WARN(.*): Use alternative feature instead.`,
      );

      expect(printer).toHaveBeenCalledWith(
        expect.stringMatching(expectedMessage),
      );
    });
  });
});
