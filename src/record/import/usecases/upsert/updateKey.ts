import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

import type { FieldSchema, RecordSchema } from "../../types/schema";
import type { KintoneRecord } from "../../types/record";

export const findUpdateKeyInSchema = (
  updateKey: string,
  schema: RecordSchema
) => {
  const updateKeySchema = schema.fields.find(
    (fieldSchema) => fieldSchema.code === updateKey
  );

  if (updateKeySchema === undefined) {
    throw new Error("no such update key");
  }

  if (!isSupportedUpdateKeyFieldType(updateKeySchema)) {
    throw new Error("unsupported field type for update key");
  }

  if (
    updateKeySchema.type === "SINGLE_LINE_TEXT" ||
    updateKeySchema.type === "NUMBER"
  ) {
    if (!updateKeySchema.unique) {
      throw new Error("update key field should set to unique");
    }
  }

  return { code: updateKey, type: updateKeySchema.type };
};

const isSupportedUpdateKeyFieldType = (
  fieldSchema: FieldSchema
): fieldSchema is
  | KintoneFormFieldProperty.RecordNumber
  | KintoneFormFieldProperty.SingleLineText
  | KintoneFormFieldProperty.Number => {
  const supportedUpdateKeyFieldTypes = [
    "RECORD_NUMBER",
    "SINGLE_LINE_TEXT",
    "NUMBER",
  ];
  return supportedUpdateKeyFieldTypes.includes(fieldSchema.type);
};
