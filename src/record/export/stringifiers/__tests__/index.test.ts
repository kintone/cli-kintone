import { input } from "./fixtures/input.js";
import { schema } from "./fixtures/schema.js";
import { stringifierFactory } from "../index.js";

describe("printRecords", () => {
  it("should print records as csv correctly", async () => {
    const { expected } = await import("./fixtures/expected_csv.js");
    const stringifier = stringifierFactory({
      format: "csv",
      schema,
      useLocalFilePath: false,
    });
    const records = stringifier(input);
    expect(records).toBe(expected);
  });

  it("should print records as json correctly", async () => {
    const { expected } = await import("./fixtures/expected_json.js");
    const stringifier = stringifierFactory({ format: "json" });
    const records = stringifier(input);
    expect(records).toBe(expected);
  });
});
