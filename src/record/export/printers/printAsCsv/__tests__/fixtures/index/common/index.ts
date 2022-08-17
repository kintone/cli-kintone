import { TestPattern } from "../../../index.test";
import { expectedCsv } from "./expected";
import { input } from "./input";
import { fieldsJson } from "./fields";
import { layoutJson } from "./layout";

export const pattern: TestPattern = {
  description: "should convert kintone records to csv string correctly",
  fieldsJson: fieldsJson,
  layoutJson: layoutJson,
  input: input,
  useLocalFilePath: true,
  expected: expectedCsv,
};
