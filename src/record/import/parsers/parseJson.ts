import { KintoneRecord } from "../types/record";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as KintoneRecord[];
};
