import type { LocalRecord } from "../types/record.js";

export type LocalRecordRepository = {
  readonly format: string;
  readonly length: () => Promise<number>;

  readonly reader: () => AsyncGenerator<LocalRecord, void, undefined>;
};
