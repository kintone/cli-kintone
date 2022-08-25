import type { KintoneRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { parseCsv } from "../index";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import { pattern as withSubtable } from "./fixtures/withSubtable";

export type TestPattern = {
  description: string;
  schema: RecordSchema;
  input: string;
  expected: KintoneRecord[];
};

describe("parseCsv", () => {
  it.each([withoutSubtable, withSubtable])("$description", (pattern) => {
    expect(parseCsv(pattern.input, pattern.schema)).toEqual(pattern.expected);
  });
});
