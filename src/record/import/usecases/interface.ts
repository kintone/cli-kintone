import type { LocalRecord } from "../types/record";

export type LocalRecordRepository = {
  readonly format: string;
  readonly length: () => Promise<number>;

  readonly reader: () => AsyncGenerator<LocalRecord, void, undefined>;
};
