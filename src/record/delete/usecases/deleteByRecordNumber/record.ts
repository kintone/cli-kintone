import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber, RecordId } from "../../types/field";
import type { KintoneRecordForResponse } from "../../../../kintone/types";

export const getAppCode = async (
  apiClient: KintoneRestAPIClient,
  app: string,
): Promise<string> => {
  return (await apiClient.app.getApp({ id: app })).code;
};

export const convertRecordNumberToRecordId = (
  recordNumbers: RecordNumber[],
  appCode: string,
): RecordId[] => {
  return recordNumbers.map((recordNumber: RecordNumber) =>
    getRecordIdFromRecordNumber(recordNumber, appCode),
  );
};

export const isValidRecordNumber = (
  input: string,
  appCode: string,
): boolean => {
  return (
    isValidRecordNumberWithoutAppCode(input) ||
    isValidRecordNumberWithAppCode(input, appCode)
  );
};

export const hasAppCode = (input: string, appCode: string): boolean => {
  return isValidRecordNumberWithAppCode(input, appCode);
};

export const getRecordIdFromRecordNumber = (
  recordNumber: RecordNumber,
  appCode: string,
): RecordId => {
  return hasAppCode(recordNumber.value, appCode)
    ? parseInt(recordNumber.value.slice(appCode.length + 1), 10)
    : parseInt(recordNumber.value, 10);
};

const isValidRecordNumberWithAppCode = (
  input: string,
  appCode: string,
): boolean => {
  return (
    input.startsWith(appCode + "-") &&
    isValidRecordNumberWithoutAppCode(input.slice(appCode.length + 1))
  );
};

const isValidRecordNumberWithoutAppCode = (input: string): boolean =>
  input.match(/^[0-9]+$/) !== null;

export const getAllRecordIds = async (
  apiClient: KintoneRestAPIClient,
  app: string,
): Promise<RecordId[]> => {
  const params = { app, fields: ["$id"] };
  const kintoneRecords = await apiClient.record.getAllRecordsWithId(params);
  if (!kintoneRecords || kintoneRecords.length === 0) {
    return [];
  }

  return kintoneRecords.map((record: KintoneRecordForResponse) =>
    parseInt(record.$id.value as string, 10),
  );
};
