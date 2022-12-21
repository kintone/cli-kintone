import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { parseCsv, TransformCSVStringToRecords } from "./parseCsv";
import { ParserError } from "./error";
import type { ReadableStream, WritableStream } from "stream/web";
import { TransformStream } from "stream/web";

export const parseRecords: (options: {
  source: string;
  format: string;
  schema: RecordSchema;
}) => Promise<KintoneRecord[]> = async (options) => {
  const { source, format, schema } = options;
  switch (format) {
    case "csv":
      return parseCsv(source, schema);
    default:
      throw new ParserError(`Unexpected file type: ${format} is unacceptable.`);
  }
};

export class TransformStringToRecords extends TransformStream<
  string,
  KintoneRecord
> {
  readable: ReadableStream<KintoneRecord>;
  writable: WritableStream<string>;
  constructor(format: string, schema: RecordSchema) {
    super();
    switch (format) {
      case "csv": {
        const parser = new TransformCSVStringToRecords(schema);
        this.writable = parser.writable;
        this.readable = parser.readable;
        break;
      }
      default:
        throw new ParserError(
          `Unexpected file type: ${format} is unacceptable.`
        );
    }
  }
}
