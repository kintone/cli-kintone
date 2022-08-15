import stringify from "csv-stringify/lib/sync";
import { KintoneRecord } from "../../types/record";
import { CsvRow, FieldsJson } from "../../../../kintone/types";
import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): void => {
  console.log(stringifyAsCsv(records, fieldsJson, attachmentsDir));
};

export const stringifyAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): string => {
  const headerFields = buildHeaderFields(fieldsJson);

  const csvRows: CsvRow[] = [];
  for (const record of recordReader(records)) {
    csvRows.push(...convertRecord(record, fieldsJson, attachmentsDir));
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
