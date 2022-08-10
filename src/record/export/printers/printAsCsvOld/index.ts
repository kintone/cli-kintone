import { convertRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../../../kintone/types";
import { KintoneRecord } from "../../types/record";

export const printAsCsv: (options: {
  records: KintoneRecord[];
  fieldsJson: FieldsJson;
  attachmentsDir?: string;
}) => void = (options) => {
  const { records, fieldsJson, attachmentsDir } = options;
  const csv = convertRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
    attachmentsDir,
  });
  console.log(csv);
};
