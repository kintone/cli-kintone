import type { CsvRow } from "../../../../../../kintone/types";
import type { RecordNumber } from "../../../../types/field";
import type { TestPattern } from "../record.test";

const input: CsvRow[] = [
  {
    Record_number: "1",
    Text: "text_01",
  },
  {
    Record_number: "2",
    Text: "text_02",
  },
];

const expected: RecordNumber[] = [
  {
    value: "1",
  },
  {
    value: "2",
  },
];

export const pattern: TestPattern = {
  description:
    "should return the correct record number from CSV without subtable",
  recordNumberFieldCode: "Record_number",
  input,
  expected,
};
