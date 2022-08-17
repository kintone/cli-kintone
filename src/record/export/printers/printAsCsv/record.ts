import type { CsvRow } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";

import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";
import { PRIMARY_MARK } from "./constants";
import { RecordSchema } from "../../types/schema";

export type RecordAsCsvRows = CsvRow[];

export const convertRecord = (
  record: KintoneRecord,
  schema: RecordSchema
): RecordAsCsvRows => {
  const primaryRow: CsvRow = {};
  for (const field of fieldReader(record, schema)) {
    primaryRow[field.code] = convertField(field, schema.useLocalFilePath);
  }

  if (!schema.hasSubtable) {
    return [primaryRow];
  }

  const subtableRows: CsvRow[] = [];
  for (const subtableField of subtableFieldReader(record, schema)) {
    subtableRows.push(
      ...convertSubtableField(subtableField, schema.useLocalFilePath)
    );
  }

  if (subtableRows.length === 0) {
    primaryRow[PRIMARY_MARK] = PRIMARY_MARK;
    return [primaryRow];
  }

  // merge primaryRow fields to all subtable rows
  const recordCsvRows: RecordAsCsvRows = subtableRows.map((subtableRow) => ({
    ...primaryRow,
    ...subtableRow,
  }));
  recordCsvRows[0][PRIMARY_MARK] = PRIMARY_MARK;

  return recordCsvRows;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export function* recordReader(
  records: KintoneRecord[]
): Generator<KintoneRecord, void, undefined> {
  yield* records;
}
