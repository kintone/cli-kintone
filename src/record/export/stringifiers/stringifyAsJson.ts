import type { LocalRecord } from "../types/record";

export const stringifyAsJson: (records: LocalRecord[]) => string = (
  records
) => {
  return JSON.stringify(records, null, 2);
};
