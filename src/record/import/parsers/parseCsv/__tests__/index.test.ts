import type { KintoneRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { parseCsv } from "../index";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import { pattern as withSubtable } from "./fixtures/withSubtable";
import { pattern as emptyCsv } from "./fixtures/emptyCsv";
import { pattern as withNoRecord } from "./fixtures/withNoRecord";

export type TestPattern = {
  description: string;
  schema: RecordSchema;
  input: string;
  expected: KintoneRecord[];
};

describe("parseCsv", () => {
  const patterns = [withoutSubtable, withSubtable, emptyCsv, withNoRecord];
  it.each(patterns)("$description", (pattern) => {
    expect(parseCsv(pattern.input, pattern.schema)).toEqual(pattern.expected);
  });
});
