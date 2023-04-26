import type { LocalRecord } from "../types/record";

export type LocalRecordRepository = {
  readonly format: string;
  readonly writer: () => Writer;
};

type Writer = {
  write: (input: LocalRecord[]) => Promise<void>;
};
