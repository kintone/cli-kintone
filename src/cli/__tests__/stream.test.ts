import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { Readable, Transform, Writable } from "stream";
import type { ReadableStream, Transformer } from "stream/web";
import csvParse from "csv-parse";
import { SEPARATOR } from "../../record/import/parsers/parseCsv/constants";
import type { CsvRow } from "../../kintone/types";
import type { KintoneRecord } from "../../record/import/types/record";
import type { RecordSchema } from "../../record/import/types/schema";
import { TransformStream } from "stream/web";
import { convertRecord } from "../../record/import/parsers/parseCsv/record";
import { schema as fixtureSchema } from "./fixtures/schema";

describe("stream", () => {
  it("should ", async () => {
    const stream = fs
      .createReadStream(
        path.resolve(__dirname, "fixtures", "fixture.csv"),
        "utf8"
      )
      .pipe(iconv.decodeStream("utf8"));
    const readable = new Readable().wrap(stream);
    const fsStream: ReadableStream<string> = Readable.toWeb(readable);

    const csvParser = csvParse({
      columns: true,
      skip_empty_lines: true,
      delimiter: SEPARATOR,
      info: true,
    });
    const transformStringToCsvRow = Transform.toWeb(
      csvParser
    ) as unknown as TransformStream<string, CsvRowWithInfo>;
    // console.log(stream.readableObjectMode);
    // console.log(csvParser.readableObjectMode);
    // console.log(process.stdout.readableObjectMode);

    // stream.pipe(csvParser).pipe(process.stdout);
    const stdout = Writable.toWeb(process.stdout);
    // await fsStream.pipeThrough(transformStringToCsvRow).pipeTo(stdout);
    const s = await fsStream
      .pipeThrough(transformStringToCsvRow)
      .pipeThrough(new TransformCsvRowsToRecordCsv())
      .pipeThrough(new TransformRecordCsvToKintoneRecord(fixtureSchema));
    for await (const str of s) {
      console.log(str);
    }
  });
});

export type CsvRowWithInfo = {
  record: CsvRow;
  info: { records: number };
};

type RecordCsv = {
  rows: CsvRow[];
  firstRowIndex: number;
  lastRowIndex: number;
};

class TransformRecordCsvToKintoneRecord extends TransformStream<
  RecordCsv,
  KintoneRecord
> {
  constructor(schema: RecordSchema) {
    const transformer: Transformer<RecordCsv, KintoneRecord> = {
      start: () => {
        /** noop **/
      },
      transform: (chunk, controller) => {
        controller.enqueue(convertRecord(chunk, schema));
      },
    };
    super(transformer);
  }
}

class TransformCsvRowsToRecordCsv extends TransformStream<
  CsvRowWithInfo,
  RecordCsv
> {
  private rows: CsvRow[] = [];
  private firstRowIndex = 1;
  private lastRowIndex = 1;
  constructor() {
    const transformer: Transformer<CsvRowWithInfo, RecordCsv> = {
      start: () => {
        /** noop **/
      },
      transform: (chunk, controller) => {
        if (chunk.record["*"]) {
          if (this.rows.length > 0) {
            const record = {
              rows: this.rows.concat(),
              firstRowIndex: this.firstRowIndex,
              lastRowIndex: this.lastRowIndex,
            };
            controller.enqueue(record);
          }
          this.rows = [];
          this.rows.push(chunk.record);
          this.firstRowIndex = chunk.info.records;
          this.lastRowIndex = chunk.info.records;
        } else {
          this.rows.push(chunk.record);
          this.lastRowIndex = chunk.info.records;
        }
      },
      flush: (controller) => {
        controller.enqueue({
          rows: this.rows.concat(),
          firstRowIndex: this.firstRowIndex,
          lastRowIndex: this.lastRowIndex,
        });
      },
    };

    super(transformer);
  }
}
