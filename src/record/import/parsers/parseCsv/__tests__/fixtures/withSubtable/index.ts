import { csv } from "./input";
import { FieldsJson } from "../../../../../../../kintone/types";
import { KintoneRecord } from "../../../../../types/record";

export const pattern: {
  description: string;
  fieldsJson: FieldsJson;
  input: string;
  expected: KintoneRecord;
} = {
  description: "should convert subtable included csv string to JSON correctly",
  fieldsJson: require("./fields.json"),
  input: csv,
  expected: require("./expected.json"),
};
