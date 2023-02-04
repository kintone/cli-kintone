import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import { RepositoryError } from "./error";
import { csvParser } from "./parsers/parseCsv";

export const buildLocalRecordRepositoryFromStream = <
  T extends NodeJS.ReadableStream
>(
  source: T,
  format: string,
  schema: RecordSchema
): LocalRecordRepository => {
  switch (format) {
    case "csv":
      return buildLocalRecordRepositoryFromCsvStream(source, schema);
    default:
      throw new RepositoryError(
        `Unexpected file type: ${format} is unacceptable.`
      );
  }
};

const buildLocalRecordRepositoryFromCsvStream = <
  T extends NodeJS.ReadableStream
>(
  source: T,
  schema: RecordSchema
): LocalRecordRepository => {
  return {
    length: 0, // TODO
    format: "csv",
    reader: () => csvParser(source, schema),
  };
};
