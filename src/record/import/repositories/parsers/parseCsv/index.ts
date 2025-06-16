import type { RecordSchema } from "../../../types/schema";

import { parse } from "csv-parse";

import { convertRecord, recordReader } from "./record";
import { SEPARATOR } from "./constants";
import { ParserError } from "../error";
import type { LocalRecordRepository } from "../../../usecases/interface";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export async function* csvReader(
  source: () => NodeJS.ReadableStream,
  schema: RecordSchema,
): ReturnType<LocalRecordRepository["reader"]> {
  try {
    const sourceStream = source();
    const csvStream = source().pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        delimiter: SEPARATOR,
      }),
    );
    sourceStream.on("error", (e) => {
      csvStream.destroy(e);
    });

    for await (const recordRows of recordReader(csvStream)) {
      yield convertRecord(recordRows, schema);
    }
  } catch (e) {
    throw new ParserError(e);
  }
}

export const countRecordsFromCsv = async (
  source: NodeJS.ReadableStream,
): Promise<number> => {
  try {
    const csvStream = source.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        delimiter: SEPARATOR,
      }),
    );
    source.on("error", (e) => {
      csvStream.destroy(e);
    });

    let count = 0;
    for await (const _ of recordReader(csvStream)) {
      count++;
    }
    return count;
  } catch (e) {
    throw new ParserError(e);
  }
};
