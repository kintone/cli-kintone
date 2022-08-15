import { CsvRow, FieldsJson } from "../../../../kintone/types";
import { KintoneRecord } from "../../types/record";
import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";
import { PRIMARY_MARK } from "./constants";

export type RecordAsCsvRows = CsvRow[];

export const convertRecord = (
  record: KintoneRecord,
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): RecordAsCsvRows => {
  const hasSubtable = _hasSubtable(fieldsJson);

  const primaryRow: CsvRow = {};
  for (const field of fieldReader(record, fieldsJson)) {
    primaryRow[field.code] = convertField(field, attachmentsDir);
  }

  if (!hasSubtable) {
    return [primaryRow];
  }

  const subtableRows: CsvRow[] = [];
  for (const subtableField of subtableFieldReader(record, fieldsJson)) {
    subtableRows.push(
      ...convertSubtableField(subtableField, fieldsJson, attachmentsDir)
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

const _hasSubtable = (fieldsJson: FieldsJson) =>
  Object.values(fieldsJson.properties).some(
    (field) => field.type === "SUBTABLE"
  );

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export function* recordReader(
  records: KintoneRecord[]
): Generator<KintoneRecord, void, undefined> {
  yield* records;
}
