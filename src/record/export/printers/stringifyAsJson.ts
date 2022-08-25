import type { KintoneRecord } from "../types/record";

export const stringifyAsJson: (records: KintoneRecord[]) => string = (
  records
) => {
  return JSON.stringify(records, null, 2);
};
