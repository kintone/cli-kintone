import { pattern as canStringifyRecordsCorrectly } from "./fixtures/canStringifyRecordsCorrectly";
import { pattern as canStringifyRecordsCorrectlyIterative } from "./fixtures/canStringifyRecordsCorrectlyIterative";
import { stringifierFactory } from "../index";

describe("stringifier", () => {
  it("should stringify records as csv correctly", async () => {
    const { input, expected, schema } = canStringifyRecordsCorrectly;
    const stringifier = stringifierFactory({
      format: "csv",
      schema,
      useLocalFilePath: false,
    });
    await stringifier.write(input);
    await stringifier.end();

    let actual = "";
    for await (const chunk of stringifier) {
      actual += chunk;
    }
    expect(actual).toBe(expected);
  });

  it("should stringify records as csv correctly (iterative)", async () => {
    const { input, expected, schema } = canStringifyRecordsCorrectlyIterative;
    const stringifier = stringifierFactory({
      format: "csv",
      schema,
      useLocalFilePath: false,
    });
    for (const localRecord of input) {
      await stringifier.write([localRecord]);
    }
    await stringifier.end();
    let actual = "";
    for await (const chunk of stringifier) {
      actual += chunk;
    }
    expect(actual).toBe(expected);
  });
});
