import { RecordForImport } from "../types/cli-kintone";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as RecordForImport[];
};
