import type { LocalRecord } from "../../../types/record";
import type { CsvRow } from "../../../../../kintone/types";
import type { RecordSchema } from "../../../types/schema";

import stringify from "csv-stringify";
import Pumpify from "pumpify";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";
import type { TransformCallback } from "stream";
import { PassThrough, Transform } from "stream";
import type { Stringifier } from "../index";

export class CsvStringifier extends Pumpify.obj implements Stringifier {
  private readonly recordTransformer: Transform;
  private readonly csvStringifier: stringify.Stringifier;

  constructor(schema: RecordSchema, useLocalFilePath: boolean) {
    const recordTransform = new RecordTransform(schema, useLocalFilePath);

    const headerFields = buildHeaderFields(schema);
    const csvStringifier = stringify({
      columns: headerFields,
      header: true,
      delimiter: SEPARATOR,
      record_delimiter: LINE_BREAK,
      quoted_match: /^(?!\*$).*$/,
      quoted_empty: false,
    });

    const encoder = new PassThrough({ encoding: "utf-8" });

    super(recordTransform, csvStringifier, encoder);
    this.recordTransformer = recordTransform;
    this.csvStringifier = csvStringifier;
  }
}

class RecordTransform extends Transform {
  private readonly schema: RecordSchema;
  private readonly useLocalFilePath: boolean;
  constructor(schema: RecordSchema, useLocalFilePath: boolean) {
    super({ objectMode: true });
    this.schema = schema;
    this.useLocalFilePath = useLocalFilePath;
  }
  _transform(
    chunk: LocalRecord[],
    encoding: BufferEncoding,
    done: TransformCallback
  ) {
    const csvRows: CsvRow[] = [];
    for (const record of recordReader(chunk)) {
      csvRows.push(
        ...convertRecord(record, this.schema, this.useLocalFilePath)
      );
    }
    for (const csvRow of csvRows) {
      this.push(csvRow);
    }
    done();
  }
}
