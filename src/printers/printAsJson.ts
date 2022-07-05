import { RecordForExport } from "../types/cli-kintone";

export const printAsJson: (records: RecordForExport[]) => void = (records) => {
  console.log(JSON.stringify(records, null, 2));
};
