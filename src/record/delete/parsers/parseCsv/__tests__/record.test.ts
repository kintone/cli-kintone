import { getRecordNumberFromCsvRows } from "../record.js";

import { pattern as withSubtable } from "./fixtures/withSubtable.js";
import { pattern as withoutSubtable } from "./fixtures/withoutSubtable.js";
import type { CsvRow } from "../../../../../kintone/types.js";
import type { RecordNumber } from "../../../types/field.js";

export type TestPattern = {
  description: string;
  recordNumberFieldCode: string;
  input: CsvRow[];
  expected: RecordNumber[];
};

describe("parseCsv", () => {
  const patterns = [withoutSubtable, withSubtable];
  it.each(patterns)("$description", (pattern) => {
    expect(
      getRecordNumberFromCsvRows(pattern.input, pattern.recordNumberFieldCode),
    ).toStrictEqual(pattern.expected);
  });
});
