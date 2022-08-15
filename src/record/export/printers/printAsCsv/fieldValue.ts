import { LINE_BREAK } from "./constants";
import * as Fields from "../../types/field";

export const convertFieldValue: (
  field: Fields.OneOf,
  attachmentsDir?: string
) => string = (field, attachmentsDir) => {
  switch (field.type) {
    case "RECORD_NUMBER":
    case "SINGLE_LINE_TEXT":
    case "RADIO_BUTTON":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "RICH_TEXT":
    case "LINK":
    case "DROP_DOWN":
    case "CALC":
    case "UPDATED_TIME":
    case "CREATED_TIME":
    case "DATETIME":
    case "DATE":
    case "TIME":
      return field.value ?? "";
    case "CREATOR":
    case "MODIFIER":
      return field.value.code;
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return field.value.join(LINE_BREAK);
    case "FILE":
      return field.value
        .map((value) => (attachmentsDir ? value.localFilePath : value.name))
        .join(LINE_BREAK);

    case "USER_SELECT":
    case "ORGANIZATION_SELECT":
    case "GROUP_SELECT":
      return field.value.map((value) => value.code).join(LINE_BREAK);
    default:
      return "";
  }
};

export const encloseInDoubleQuotes: (fieldValue: string) => string = (
  fieldValue
) => `"${fieldValue ? fieldValue : ""}"`;

export const escapeDoubleQuotes = (fieldValue?: string | null) =>
  fieldValue ? fieldValue.replace(/"/g, '""') : "";
