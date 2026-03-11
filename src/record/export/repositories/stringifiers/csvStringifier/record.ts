import type { CsvRow } from "../../../../../kintone/types.js";
import type { LocalRecord } from "../../../types/record.js";

import { convertField, fieldReader } from "./field.js";
import { convertSubtableField, subtableFieldReader } from "./subtable.js";
import { PRIMARY_MARK } from "./constants.js";
import type { RecordSchema } from "../../../types/schema.js";

export type RecordAsCsvRows = CsvRow[];

export const convertRecord = (
  record: LocalRecord,
  schema: RecordSchema,
  useLocalFilePath: boolean,
): RecordAsCsvRows => {
  const primaryRow: CsvRow = {};
  for (const field of fieldReader(record, schema)) {
    primaryRow[field.code] = convertField(field, useLocalFilePath);
  }

  if (!schema.hasSubtable) {
    return [primaryRow];
  }

  const subtableRows: CsvRow[] = [];
  for (const subtableField of subtableFieldReader(record, schema)) {
    subtableRows.push(...convertSubtableField(subtableField, useLocalFilePath));
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
  records: LocalRecord[],
): Generator<LocalRecord, void, undefined> {
  yield* records;
}
