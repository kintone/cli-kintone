import type { LocalRecord } from "../../../types/record";
import type { CsvRow } from "../../../../../kintone/types";
import type { RecordSchema } from "../../../types/schema";

import {
  stringify,
  type Stringifier as CsvStringifyStringifier,
} from "csv-stringify";

import { convertRecord, recordReader } from "./record";
import { LINE_BREAK, SEPARATOR } from "./constants";
import { buildHeaderFields } from "./header";
import type { TransformCallback } from "stream";
import { PassThrough, Transform } from "stream";
import type { Stringifier } from "../index";

export class CsvStringifier implements Stringifier {
  private readonly recordTransformer: Transform;
  private readonly csvStringifier: CsvStringifyStringifier;
  private readonly encoder: PassThrough;

  constructor(schema: RecordSchema, useLocalFilePath: boolean) {
    const recordTransform = new RecordsTransform(schema, useLocalFilePath);

    const headerFields = buildHeaderFields(schema);
    const csvStringifier = stringify({
      columns: headerFields,
      header: true,
      delimiter: SEPARATOR,
      record_delimiter: LINE_BREAK,
      quoted_match: /^(?!\*$).+$/,
      quoted_empty: false,
    });

    this.recordTransformer = recordTransform;
    this.csvStringifier = csvStringifier;
    this.encoder = new PassThrough({ encoding: "utf-8" });
    this.recordTransformer.pipe(this.csvStringifier).pipe(this.encoder);
  }

  async write(records: LocalRecord[]) {
    return new Promise<void>((resolve, reject) => {
      this.recordTransformer.write(records, (e) => {
        if (e) {
          reject(e);
        }
        resolve();
      });
    });
  }
  read(size?: number) {
    return this.encoder.read(size);
  }
  async end() {
    return new Promise<void>((resolve) => {
      this.recordTransformer.end(resolve);
    });
  }
  pipe<T extends NodeJS.WritableStream>(destination: T) {
    this.encoder.pipe(destination);
  }
  async *[Symbol.asyncIterator](): AsyncGenerator<string, void, undefined> {
    yield* this.encoder;
  }
}

class RecordsTransform extends Transform {
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
    done: TransformCallback,
  ) {
    const csvRows: CsvRow[] = [];
    for (const record of recordReader(chunk)) {
      csvRows.push(
        ...convertRecord(record, this.schema, this.useLocalFilePath),
      );
    }
    for (const csvRow of csvRows) {
      this.push(csvRow);
    }
    done();
  }
}
