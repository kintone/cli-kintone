import csvParse from "csv-parse/lib/sync";
import { CsvRow, FieldsJson } from "../../../../kintone/types";
import { KintoneRecord } from "../../types/record";
import { convertRecord, recordReader } from "./record";

export const parseCsv: (
  csv: string,
  fieldsJson: FieldsJson
) => KintoneRecord[] = (csv, fieldsJson) => {
  const rows: CsvRow[] = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  const records: KintoneRecord[] = [];

  for (const recordRows of recordReader(rows)) {
    const record = convertRecord(recordRows, fieldsJson);
    records.push(record);
  }

  return records;
};
