import { input } from "./fixtures/input";
import { schema } from "./fixtures/schema";
import { stringifierFactory } from "../index";

describe("printRecords", () => {
  it("should print records as csv correctly", async () => {
    const { expected } = await import("./fixtures/expected_csv");
    const stringifier = stringifierFactory({
      format: "csv",
      schema,
      useLocalFilePath: false,
    });
    const records = stringifier(input);
    expect(records).toBe(expected);
  });

  it("should print records as json correctly", async () => {
    const { expected } = await import("./fixtures/expected_json");
    const stringifier = stringifierFactory({ format: "json" });
    const records = stringifier(input);
    expect(records).toBe(expected);
  });
});
