import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import { RepositoryError } from "./error";
import { countRecordsFromCsv, csvReader } from "./parsers/parseCsv";
import type { LocalRecord } from "../types/record";

export class LocalRecordRepositoryFromStream implements LocalRecordRepository {
  readonly format: string;
  readonly length: () => Promise<number>;

  readonly reader: () => AsyncGenerator<LocalRecord, void, undefined>;

  constructor(
    openReadableSource: () => NodeJS.ReadableStream,
    format: string,
    schema: RecordSchema
  ) {
    this.format = format;
    this.length = () => countRecordsFromCsv(openReadableSource());

    switch (format) {
      case "csv":
        this.reader = () => csvReader(openReadableSource, schema);
        break;
      default:
        throw new RepositoryError(
          `Unexpected file type: ${format} is unacceptable.`
        );
    }
  }
}
