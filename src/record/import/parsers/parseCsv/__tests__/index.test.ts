import type { KintoneRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { parseCsv } from "../index";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import { pattern as withSubtable } from "./fixtures/withSubtable";
import { pattern as emptyCsv } from "./fixtures/emptyCsv";
import { pattern as withNoRecord } from "./fixtures/withNoRecord";
import { pattern as withCrLf } from "./fixtures/withCrLf";
import { pattern as withCr } from "./fixtures/withCr";
import { pattern as withLf } from "./fixtures/withLf";

export type TestPattern = {
  description: string;
  schema: RecordSchema;
  input: string;
  expected: KintoneRecord[];
};

describe("parseCsv", () => {
  const patterns = [
    withoutSubtable,
    withSubtable,
    emptyCsv,
    withNoRecord,
    withCrLf,
    withCr,
    withLf,
  ];
  it.each(patterns)("$description", (pattern) => {
    expect(parseCsv(pattern.input, pattern.schema)).toStrictEqual(
      pattern.expected
    );
  });
});
