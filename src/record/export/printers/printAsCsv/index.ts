import stringify from "csv-stringify/lib/sync";
import { KintoneRecord } from "../../types/record";
import { CsvRow, FieldsJson } from "../../../../kintone/types";
import { convertRecord, recordReader } from "./record";
import { hasSubtable } from "../printAsCsvOld/hasSubtable";
import { PRIMARY_MARK } from "../printAsCsvOld/constants";
import {
  LINE_BREAK,
  SEPARATOR,
  supportedFieldTypes,
  supportedFieldTypesInSubtable,
} from "./constants";

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): void => {
  console.log(stringifyAsCsv(records, fieldsJson, attachmentsDir));
};

export const stringifyAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): string => {
  const headerFields = buildHeaderFields(fieldsJson);

  const csvRows: CsvRow[] = [];
  for (const record of recordReader(records)) {
    csvRows.push(...convertRecord(record, fieldsJson, attachmentsDir));
  }

  return stringify(csvRows, {
    columns: headerFields,
    header: true,
    delimiter: SEPARATOR,
    record_delimiter: LINE_BREAK,
    quoted_match: /^(?!\*$).*$/,
    quoted_empty: false,
  });
};

// TODO: refactor
const buildHeaderFields = (fieldsJson: FieldsJson) => {
  const fields = Object.keys(fieldsJson.properties)
    .filter((fieldCode) =>
      supportedFieldTypes.includes(fieldsJson.properties[fieldCode].type)
    )
    .reduce((headerFields, fieldCode) => {
      const field = fieldsJson.properties[fieldCode];
      if (field.type === "SUBTABLE") {
        const fieldCodesInSubtable = Object.keys(field.fields).filter(
          (fieldCodeInSubtable) =>
            supportedFieldTypesInSubtable.includes(
              field.fields[fieldCodeInSubtable].type
            )
        );
        return headerFields.concat(fieldCode, ...fieldCodesInSubtable);
      }
      return headerFields.concat(fieldCode);
    }, [] as string[]);

  return hasSubtable(fieldsJson.properties)
    ? [PRIMARY_MARK].concat(fields)
    : fields;
};
