import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

import type { FieldSchema, RecordSchema } from "../../types/schema";
import type { KintoneRecord } from "../../types/record";

export const findUpdateKeyInSchema = (
  updateKey: string,
  schema: RecordSchema
): { code: string; type: SupportedUpdateKeyFieldType["type"] } => {
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

export type SupportedUpdateKeyFieldType =
  | KintoneFormFieldProperty.RecordNumber
  | KintoneFormFieldProperty.SingleLineText
  | KintoneFormFieldProperty.Number;

const isSupportedUpdateKeyFieldType = (
  fieldSchema: FieldSchema
): fieldSchema is SupportedUpdateKeyFieldType => {
  const supportedUpdateKeyFieldTypes = [
    "RECORD_NUMBER",
    "SINGLE_LINE_TEXT",
    "NUMBER",
  ];
  return supportedUpdateKeyFieldTypes.includes(fieldSchema.type);
};

export const validateUpdateKeyInRecords = (
  updateKey: { code: string; type: SupportedUpdateKeyFieldType["type"] },
  appCode: string,
  records: KintoneRecord[]
) => {
  let hasAppCodePrevious: boolean = false;
  records.forEach((record, index) => {
    if (!(updateKey.code in record)) {
      throw new Error(
        `The field specified as "Key to Bulk Update" (${updateKey.code}) does not exist on the input`
      );
    }
    const value = record[updateKey.code].value;
    if (typeof value !== "string") {
      throw new Error(
        `The value of the "Key to Bulk Update" (${updateKey.code}) on the input is invalid`
      );
    }

    if (updateKey.type === "RECORD_NUMBER") {
      const _hasAppCode = hasAppCode(value, appCode);
      if (index !== 0 && _hasAppCode !== hasAppCodePrevious) {
        throw new Error(
          `The "Key to Bulk Update" should not be mixed with those with and without app code`
        );
      }
      hasAppCodePrevious = _hasAppCode;
    }
  });
};

export const removeAppCode = (input: string, appCode: string) => {
  if (hasAppCode(input, appCode)) {
    return input.slice(appCode.length + 1);
  }
  return input;
};

export const hasAppCode = (input: string, appCode: string): boolean => {
  const matchWithAppCode = isValidUpdateKeyWithAppCode(input, appCode);
  const matchWithoutAppCode = isValidUpdateKeyWithoutAppCode(input);

  if (!matchWithAppCode && !matchWithoutAppCode) {
    throw new Error(`The "Key to Bulk Update" value is invalid (${input})`);
  }

  return matchWithAppCode && !matchWithoutAppCode;
};

const isValidUpdateKeyWithAppCode = (input: string, appCode: string) => {
  return (
    input.startsWith(appCode + "-") &&
    isValidUpdateKeyWithoutAppCode(input.slice(appCode.length + 1))
  );
};

const isValidUpdateKeyWithoutAppCode = (input: string) =>
  input.match(/^[0-9]+$/) !== null;
