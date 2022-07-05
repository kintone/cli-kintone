import { convertRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../types/kintone";
import { RecordForExport } from "../../types/cli-kintone";

export const printAsCsv: (options: {
  records: RecordForExport[];
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
