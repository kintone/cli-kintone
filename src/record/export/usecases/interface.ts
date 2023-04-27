import type { Writable } from "stream";

export type LocalRecordRepository = {
  readonly format: string;
  readonly writer: () => Writer;
};

type Writer = Writable;
