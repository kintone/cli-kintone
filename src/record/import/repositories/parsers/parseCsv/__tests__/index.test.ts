import type { LocalRecord } from "../../../../types/record.js";
import type { RecordSchema } from "../../../../types/schema.js";

import { csvReader } from "../index.js";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable/index.js";
import { pattern as withSubtable } from "./fixtures/withSubtable/index.js";
import { pattern as withMultipleSubtable } from "./fixtures/withMultipleSubtable/index.js";
import { pattern as emptyCsv } from "./fixtures/emptyCsv/index.js";
import { pattern as withNoRecord } from "./fixtures/withNoRecord/index.js";
import { pattern as withCrLf } from "./fixtures/withCrLf/index.js";
import { pattern as withCr } from "./fixtures/withCr/index.js";
import { pattern as withLf } from "./fixtures/withLf/index.js";
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
    for await (const record of csvReader(
      () => Readable.from(pattern.input),
      pattern.schema,
    )) {
      records.push(record);
    }
    expect(records).toStrictEqual(pattern.expected);
  });
});
