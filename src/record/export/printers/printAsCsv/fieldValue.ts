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
      return escapeDoubleQuotes(field.value);
    case "CREATOR":
    case "MODIFIER":
      return escapeDoubleQuotes(field.value.code);
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return escapeDoubleQuotes(field.value.join(LINE_BREAK));
    case "FILE":
      return escapeDoubleQuotes(
        field.value
          .map((value) => (attachmentsDir ? value.localFilePath : value.name))
          .join(LINE_BREAK)
      );
    case "USER_SELECT":
    case "ORGANIZATION_SELECT":
    case "GROUP_SELECT":
      return escapeDoubleQuotes(
        field.value.map((value) => value.code).join(LINE_BREAK)
      );
    default:
      return "";
  }
};

export const encloseInDoubleQuotes: (fieldValue: string) => string = (
  fieldValue
) => `"${fieldValue ? fieldValue : ""}"`;

export const escapeDoubleQuotes = (fieldValue?: string | null) =>
  fieldValue ? fieldValue.replace(/"/g, '""') : "";
