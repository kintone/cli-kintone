import type { CsvRow, FieldsJson } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";

import { convertField, fieldReader } from "./field";
import {
  convertSubtableField,
  hasSubtable,
  subtableFieldReader,
} from "./subtable";
import { PRIMARY_MARK } from "./constants";

export type RecordAsCsvRows = CsvRow[];

export const convertRecord = (
  record: KintoneRecord,
  fieldsJson: FieldsJson,
  useLocalFilePath: boolean
): RecordAsCsvRows => {
  const _hasSubtable = hasSubtable(fieldsJson);

  const primaryRow: CsvRow = {};
  for (const field of fieldReader(record, fieldsJson)) {
    primaryRow[field.code] = convertField(field, useLocalFilePath);
  }

  if (!_hasSubtable) {
    return [primaryRow];
  }

  const subtableRows: CsvRow[] = [];
  for (const subtableField of subtableFieldReader(record, fieldsJson)) {
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
  records: KintoneRecord[]
): Generator<KintoneRecord, void, undefined> {
  yield* records;
}
