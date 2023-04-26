import type { LocalRecord } from "../../../types/record";
import type { CsvRow } from "../../../../../kintone/types";
import type { RecordSchema } from "../../../types/schema";

import stringify from "csv-stringify";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";
import type { Stringifier } from "../index";

export class CsvStringifier implements Stringifier {
  private readonly csvStringifier: stringify.Stringifier;
  private readonly schema: RecordSchema;
  private readonly useLocalFilePath: boolean;
  constructor(schema: RecordSchema, useLocalFilePath: boolean) {
    this.schema = schema;
    this.useLocalFilePath = useLocalFilePath;

    const headerFields = buildHeaderFields(schema);
    this.csvStringifier = stringify({
      columns: headerFields,
      header: true,
      delimiter: SEPARATOR,
      record_delimiter: LINE_BREAK,
      quoted_match: /^(?!\*$).*$/,
      quoted_empty: false,
    });
  }

  async stringify(records: LocalRecord[]): Promise<string> {
    const csvRows: CsvRow[] = [];
    for (const record of recordReader(records)) {
      csvRows.push(
        ...convertRecord(record, this.schema, this.useLocalFilePath)
      );
    }
    for (const csvRow of csvRows) {
      this.csvStringifier.write(csvRow);
    }
    let csvString = "";
    for await (const chunk of this.csvStringifier) {
      csvString += chunk;
      if (this.csvStringifier.readableLength === 0) {
        return csvString;
      }
    }
    return csvString;
  }
}
