import type { KintoneRecord } from "../../types/record";
import type { CsvRow, FieldsJson } from "../../../../kintone/types";

import stringify from "csv-stringify/lib/sync";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  useLocalFilePath: boolean
): void => {
  console.log(stringifyAsCsv(records, fieldsJson, useLocalFilePath));
};

export const stringifyAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  useLocalFilePath: boolean
): string => {
  const headerFields = buildHeaderFields(fieldsJson);

  const csvRows: CsvRow[] = [];
  for (const record of recordReader(records)) {
    csvRows.push(...convertRecord(record, fieldsJson, useLocalFilePath));
  }

  return stringify(csvRows, {
    columns: headerFields,
    header: true,
    delimiter: SEPARATOR,
    record_delimiter: LINE_BREAK,
    quoted_match: /^(?!\*$).*$/,
    quoted_empty: false,
  });
};
