import type { CsvRow } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

import csvParse from "csv-parse/lib/sync";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";

export const parseCsv: (
  csv: string,
  schema: RecordSchema
) => KintoneRecord[] = (csv, schema) => {
  const rows: CsvRow[] = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
    delimiter: SEPARATOR,
    record_delimiter: LINE_BREAK,
  });

  const records: KintoneRecord[] = [];

  for (const recordRows of recordReader(rows)) {
    const record = convertRecord(recordRows, schema);
    records.push(record);
  }

  return records;
};
