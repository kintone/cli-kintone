import type { KintoneRecord } from "../types/record.js";

export const stringifyAsJson: (records: KintoneRecord[]) => string = (
  records
) => {
  return JSON.stringify(records, null, 2);
};
