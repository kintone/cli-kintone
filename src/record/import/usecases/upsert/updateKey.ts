import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

import type { FieldSchema, RecordSchema } from "../../types/schema";
import type { KintoneRecord } from "../../types/record";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

type UpdateKeyField = {
  code: string;
  type: SupportedUpdateKeyFieldType["type"];
};

export class UpdateKey {
  private readonly field: UpdateKeyField;
  private readonly appCode: string;
  private readonly existingUpdateKeyValues: Set<string>;

  constructor(
    field: UpdateKeyField,
    appCode: string,
    existingUpdateKeyValues: Set<string>
  ) {
    this.field = field;
    this.appCode = appCode;
    this.existingUpdateKeyValues = existingUpdateKeyValues;
  }

  static build = async (
    apiClient: KintoneRestAPIClient,
    app: string,
    updateKeyCode: string,
    schema: RecordSchema
  ): Promise<UpdateKey> => {
    const updateKeyField = findUpdateKeyInSchema(updateKeyCode, schema);
    const appCode = (await apiClient.app.getApp({ id: app })).code;
    const recordsOnKintone = await apiClient.record.getAllRecords({
      app,
      fields: [updateKeyField.code],
    });
    const existingUpdateKeyValues = new Set(
      recordsOnKintone.map((record) => {
        const updateKeyValue = record[updateKeyField.code].value as string;
        if (updateKeyField.type === "RECORD_NUMBER") {
          return removeAppCode(updateKeyValue, appCode);
        }
        return updateKeyValue;
      })
    );

    return new UpdateKey(updateKeyField, appCode, existingUpdateKeyValues);
  };

  getUpdateKeyField = () => this.field;

  validateUpdateKeyInRecords = (records: KintoneRecord[]) =>
    validateUpdateKeyInRecords(this.field, this.appCode, records);

  isUpdate = (record: KintoneRecord) => {
    const updateKeyValue = this.findUpdateKeyValueFromRecord(record);
    return (
      updateKeyValue.length > 0 &&
      this.existingUpdateKeyValues.has(updateKeyValue)
    );
  };

  findUpdateKeyValueFromRecord = (record: KintoneRecord): string => {
    const fieldValue = record.data[this.field.code].value as string;
    if (fieldValue.length === 0) {
      return fieldValue;
    }
    if (this.field.type === "RECORD_NUMBER") {
      return removeAppCode(fieldValue, this.appCode);
    }
    return fieldValue;
  };
}

const findUpdateKeyInSchema = (
  updateKey: string,
  schema: RecordSchema
): UpdateKeyField => {
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

type SupportedUpdateKeyFieldType =
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

const validateUpdateKeyInRecords = (
  updateKey: UpdateKeyField,
  appCode: string,
  records: KintoneRecord[]
) => {
  let hasAppCodePrevious: boolean = false;
  records.forEach((record, index) => {
    if (!(updateKey.code in record.data)) {
      throw new Error(
        `The field specified as "Key to Bulk Update" (${updateKey.code}) does not exist on the input`
      );
    }
    const value = record.data[updateKey.code].value;
    if (typeof value !== "string") {
      throw new Error(
        `The value of the "Key to Bulk Update" (${updateKey.code}) on the input is invalid`
      );
    }

    if (value.length === 0) {
      return;
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

const removeAppCode = (input: string, appCode: string) => {
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
