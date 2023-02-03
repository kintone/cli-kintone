import type { RecordNumber } from "./field";

export type InvalidRecordNumber = {
  invalidValue?: RecordNumber[];
  notExists?: RecordNumber[];
  duplicated?: RecordNumber[];
};
