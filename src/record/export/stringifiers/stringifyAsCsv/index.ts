import type { KintoneRecord } from "../../types/record.js";
import type { CsvRow } from "../../../../kintone/types.js";
import type { RecordSchema } from "../../types/schema.js";

import stringify from "csv-stringify/lib/sync.js";

import { convertRecord, recordReader } from "./record.js";
import { LINE_BREAK, SEPARATOR } from "./constants.js";
import { buildHeaderFields } from "./header.js";

export const stringifyAsCsv = (
  records: KintoneRecord[],
  schema: RecordSchema,
  useLocalFilePath: boolean
): string => {
  const headerFields = buildHeaderFields(schema);

  const csvRows: CsvRow[] = [];
  for (const record of recordReader(records)) {
    csvRows.push(...convertRecord(record, schema, useLocalFilePath));
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
