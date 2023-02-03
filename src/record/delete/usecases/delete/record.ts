import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber, RecordId } from "../../types/field";

export const getAppCode = async (
  apiClient: KintoneRestAPIClient,
  app: string
): Promise<string> => {
  return (await apiClient.app.getApp({ id: app })).code;
};

export const convertRecordNumberToRecordId = (
  recordNumbers: RecordNumber[],
  appCode: string
): RecordId[] => {
  const isHasAppcode = hasAppCode(recordNumbers[0].value, appCode);

  return recordNumbers.map((recordNumber: RecordNumber) =>
    isHasAppcode
      ? parseInt(recordNumber.value.slice(appCode.length + 1), 10)
      : parseInt(recordNumber.value, 10)
  );
};

export const isValidRecordNumber = (
  input: string,
  appCode: string
): boolean => {
  return (
    isValidRecordNumberWithoutAppCode(input) ||
    isValidRecordNumberWithAppCode(input, appCode)
  );
};

const hasAppCode = (input: string, appCode: string): boolean => {
  return isValidRecordNumberWithAppCode(input, appCode);
};

const isValidRecordNumberWithAppCode = (
  input: string,
  appCode: string
): boolean => {
  return (
    input.startsWith(appCode + "-") &&
    isValidRecordNumberWithoutAppCode(input.slice(appCode.length + 1))
  );
};

const isValidRecordNumberWithoutAppCode = (input: string): boolean =>
  input.match(/^[0-9]+$/) !== null;
