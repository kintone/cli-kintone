import { KintoneRecord } from "../types/record";

export const printAsJson: (records: KintoneRecord[]) => void = (records) => {
  console.log(JSON.stringify(records, null, 2));
};
