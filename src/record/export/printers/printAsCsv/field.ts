import { KintoneRecord } from "../../types/record";
import * as Fields from "../../types/field";
import { convertFieldValue } from "./fieldValue";
import { FieldsJson } from "../../../../kintone/types";
import { supportedFieldTypes } from "./constants";

type Field = {
  code: string;
  value: Fields.OneOf;
};

export const convertField = (field: Field, attachmentsDir?: string): string => {
  return convertFieldValue(field.value, attachmentsDir);
};

// eslint-disable-next-line func-style
export function* fieldReader(
  record: KintoneRecord,
  fieldsJson: FieldsJson
): Generator<Field, void, undefined> {
  for (const [code, properties] of Object.entries(fieldsJson.properties)) {
    if (!supportedFieldTypes.includes(properties.type)) {
      continue;
    }

    if (properties.type === "SUBTABLE") {
      continue;
    }

    if (!(code in record)) {
      throw new Error(`The record is missing a field (${code})`);
    }
    yield { code, value: record[code] };
  }
}
