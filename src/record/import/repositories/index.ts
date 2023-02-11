import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import { RepositoryError } from "./error";
import { countRecordsFromCsv, csvReader } from "./parsers/parseCsv";

export class LocalRecordRepositoryByStream<T extends NodeJS.ReadableStream>
  implements LocalRecordRepository
{
  readonly format;
  readonly length;
  readonly reader;

  constructor(source: () => T, format: string, schema: RecordSchema) {
    this.format = format;
    this.length = () => countRecordsFromCsv(source());

    switch (format) {
      case "csv":
        this.reader = () => csvReader(source, schema);
        break;
      default:
        throw new RepositoryError(
          `Unexpected file type: ${format} is unacceptable.`
        );
    }
  }
}
