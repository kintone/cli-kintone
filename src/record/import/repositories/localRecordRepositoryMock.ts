import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import type { LocalRecord } from "../types/record";
import { Readable } from "stream";
import { number } from "yargs";

export class LocalRecordRepositoryMock implements LocalRecordRepository {
  readonly format: string;
  readonly length: () => Promise<number>;

  readonly reader: () => AsyncGenerator<LocalRecord, void, undefined>;

  constructor(source: LocalRecord[], format: string, length: number) {
    this.format = format;
    this.length = async () => length;
    this.reader = () => asyncGeneratorFromStream(source);
  }
}

// eslint-disable-next-line func-style
async function* asyncGeneratorFromStream(
  source: LocalRecord[]
): AsyncGenerator<LocalRecord, void, undefined> {
  yield* source;
}
