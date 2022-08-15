import type { KintoneRecord } from "../../types/record";
import type * as Fields from "../../types/field";
import type { FieldsJson } from "../../../../kintone/types";

import { supportedFieldTypes } from "./constants";
import { convertFieldValue } from "./fieldValue";

type Field = {
  code: string;
  value: Fields.OneOf;
};

export const convertField = (
  field: Field,
  useLocalFilePath: boolean
): string => {
  return convertFieldValue(field.value, useLocalFilePath);
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
