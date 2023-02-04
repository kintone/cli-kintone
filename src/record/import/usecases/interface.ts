import type { LocalRecord } from "../types/record";

export type LocalRecordRepository = {
  readonly length: number;
  readonly format: string;
  readonly reader: () => AsyncGenerator<LocalRecord, void, undefined>;
};
