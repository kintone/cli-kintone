import type { CsvRow } from "../../../../../kintone/types";
import type { LocalRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

// import csvParse from "csv-parse/lib/sync";
import csvParse from "csv-parse";

import { convertRecord, recordReader } from "./record";
import { SEPARATOR } from "./constants";
import { ParserError } from "../error";
import type { LocalRecordRepository } from "../../../usecases/interface";
import { logger } from "../../../../../utils/log";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export async function* csvReader<T extends NodeJS.ReadableStream>(
  source: () => T,
  schema: RecordSchema
): ReturnType<LocalRecordRepository["reader"]> {
  try {
    const csvStream = source().pipe(
      csvParse({
        columns: true,
        skip_empty_lines: true,
        delimiter: SEPARATOR,
      })
    );

    for await (const recordRows of recordReader(csvStream)) {
      yield convertRecord(recordRows, schema);
    }
  } catch (e) {
    console.error(e);
    throw new ParserError(e);
  }
}

export const countRecordsFromCsv = async <T extends NodeJS.ReadableStream>(
  source: T
): Promise<number> => {
  try {
    const csvStream = source.pipe(
      csvParse({
        columns: true,
        skip_empty_lines: true,
        delimiter: SEPARATOR,
      })
    );

    let count = 0;
    for await (const recordRows of recordReader(csvStream)) {
      count++;
    }
    return count;
  } catch (e) {
    console.error(e);
    throw new ParserError(e);
  }
};
