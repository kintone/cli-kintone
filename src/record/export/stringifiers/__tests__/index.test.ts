import path from "path";
import fs from "fs/promises";

import { input } from "./fixtures/input";
import { schema } from "./fixtures/schema";
import { stringifyRecords } from "../index";

describe("printRecords", () => {
  it("should print records as csv (utf8) correctly", async () => {
    const expected = await fs.readFile(
      path.join(__dirname, "./fixtures/expected_utf8.csv")
    );
    const records = stringifyRecords({
      records: input,
      schema,
      format: "csv",
      encoding: "utf8",
      useLocalFilePath: false,
    });
    expect(records).toStrictEqual(expected);
  });

  it("should print records as csv (sjis) correctly", async () => {
    const expected = await fs.readFile(
      path.join(__dirname, "./fixtures/expected_sjis.csv")
    );
    const records = stringifyRecords({
      records: input,
      schema,
      format: "csv",
      encoding: "sjis",
      useLocalFilePath: false,
    });
    expect(records).toStrictEqual(expected);
  });

  it("should print records as json correctly", async () => {
    const { expected } = await import("./fixtures/expected_json_utf8");
    const records = stringifyRecords({
      records: input,
      schema,
      format: "json",
      encoding: "utf8",
      useLocalFilePath: false,
    });
    expect(records).toStrictEqual(Buffer.from(expected));
  });

  it("throws error if format is JSON and encoding is not 'utf8'", () => {
    expect(() =>
      stringifyRecords({
        records: input,
        schema,
        format: "json",
        encoding: "sjis",
        useLocalFilePath: false,
      })
    ).toThrow("When the output format is JSON, the encoding MUST be UTF-8");
  });
});
