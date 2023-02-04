import type { LocalRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";

import { csvParser } from "../index";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import { pattern as withSubtable } from "./fixtures/withSubtable";
import { pattern as withMultipleSubtable } from "./fixtures/withMultipleSubtable";
import { pattern as emptyCsv } from "./fixtures/emptyCsv";
import { pattern as withNoRecord } from "./fixtures/withNoRecord";
import { pattern as withCrLf } from "./fixtures/withCrLf";
import { pattern as withCr } from "./fixtures/withCr";
import { pattern as withLf } from "./fixtures/withLf";
import { Readable } from "stream";

export type TestPattern = {
  description: string;
  schema: RecordSchema;
  input: string;
  expected: LocalRecord[];
};

describe("parseCsv", () => {
  const patterns = [
    withoutSubtable,
    withSubtable,
    withMultipleSubtable,
    emptyCsv,
    withNoRecord,
    withCrLf,
    withCr,
    withLf,
  ];
  it.each(patterns)("$description", async (pattern) => {
    const records = [];
    for await (const record of csvParser(
      Readable.from(pattern.input),
      pattern.schema
    )) {
      records.push(record);
    }
    expect(records).toStrictEqual(pattern.expected);
  });
});
