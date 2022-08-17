import type { KintoneRecord } from "../../types/record";
import type { CsvRow } from "../../../../kintone/types";
import type { RecordSchema } from "../../types/schema";

import stringify from "csv-stringify/lib/sync";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";

export const printAsCsv = (
  records: KintoneRecord[],
  schema: RecordSchema
): void => {
  console.log(stringifyAsCsv(records, schema));
};

export const stringifyAsCsv = (
  records: KintoneRecord[],
  schema: RecordSchema
): string => {
  const headerFields = buildHeaderFields(schema);

  const csvRows: CsvRow[] = [];
  for (const record of recordReader(records)) {
    csvRows.push(...convertRecord(record, schema));
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
