import type { LocalRecord } from "../types/record.js";

export type LocalRecordRepository = {
  readonly format: string;
  readonly writer: () => Writer;
};

export type Writer = {
  write(records: LocalRecord[]): Promise<void>;
  end(): Promise<void>;
};
