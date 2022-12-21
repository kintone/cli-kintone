import type { CsvRow } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

import csvParse from "csv-parse";

import { convertRecord, recordReader } from "./record";
import { SEPARATOR } from "./constants";
import { ParserError } from "../error";
import type { ReadableStream, Transformer, WritableStream } from "stream/web";
import { TransformStream } from "stream/web";
import { Duplex, Readable, Transform, Writable } from "stream";

export const parseCsv: (
  csv: string,
  schema: RecordSchema
) => KintoneRecord[] = (csv, schema) => {
  try {
    const rows: CsvRow[] = csvParse(csv, {
      columns: true,
      skip_empty_lines: true,
      delimiter: SEPARATOR,
    });

    const records: KintoneRecord[] = [];

    for (const recordRows of recordReader(rows)) {
      const record = convertRecord(recordRows, schema);
      records.push(record);
    }

    return records;
  } catch (e) {
    throw new ParserError(e);
  }
};

export class ParseCsvRowsToRecordCsV extends TransformStream<
  RecordCsv[],
  KintoneRecord
> {
  constructor(schema: RecordSchema) {
    const transformer: Transformer<CsvRow[], KintoneRecord> = {
      start: () => {
        /** noop **/
      },
      transform: (chunk, controller) => {
        controller.desiredSize;
        const record = convertRecord(chunk, schema);
      },
    };

    super(transformer);
  }
}

export class TransformCsvRowsToRecord extends TransformStream<
  CsvRow,
  KintoneRecord
> {
  constructor(schema: RecordSchema) {
    const transformer: Transformer<CsvRow, KintoneRecord> = {
      start: () => {
        /** noop **/
      },
      transform: (chunk, controller) => {
        const record = convertRecord(chunk, schema);
      },
    };

    super(transformer);
  }
}

export class TransformCSVStringToRecords extends TransformStream<
  string,
  KintoneRecord
> {
  readable: ReadableStream<KintoneRecord>;
  writable: WritableStream<string>;
  constructor(schema: RecordSchema) {
    super();

    const transformStringToCsvRow = Transform.toWeb(
      csvParse({
        columns: true,
        skip_empty_lines: true,
        delimiter: SEPARATOR,
      })
    ) as unknown as TransformStream<string, CsvRow>;
    const transformCsvRowsToRecord = new TransformCsvRowsToRecord(schema);

    this.writable = transformStringToCsvRow.writable;
    this.readable = transformCsvRowsToRecord.readable;
    transformStringToCsvRow.readable.pipeTo(transformCsvRowsToRecord.writable);
  }
}
