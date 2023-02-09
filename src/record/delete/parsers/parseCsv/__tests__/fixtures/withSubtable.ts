import type { CsvRow } from "../../../../../../kintone/types";
import type { RecordNumber } from "../../../../types/field";
import type { TestPattern } from "../record.test";

const input: CsvRow[] = [
  {
    "*": "*",
    Record_number: "appcode-1",
    Table: "1",
    Text: "table_text_01",
    Number: "1",
  },
  {
    "*": "",
    Record_number: "appcode-1",
    Table: "2",
    Text: "table_text_01-2",
    Number: "2",
  },
  {
    "*": "*",
    Record_number: "appcode-2",
    Table: "3",
    Text: "table_text_02",
    Number: "3",
  },
];

const expected: RecordNumber[] = [
  {
    value: "appcode-1",
  },
  {
    value: "appcode-2",
  },
];

export const pattern: TestPattern = {
  description: "should return the correct record number from CSV with subtable",
  recordNumberFieldCode: "Record_number",
  input,
  expected,
};
