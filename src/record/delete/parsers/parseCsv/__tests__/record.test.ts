import { getRecordNumberFromCsvRows } from "../record";

import { pattern as withSubtable } from "./fixtures/withSubtable";
import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import type { CsvRow } from "../../../../../kintone/types";
import type { RecordNumber } from "../../../types/field";

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
