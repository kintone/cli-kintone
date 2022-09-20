import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { KintoneRecord } from "../types/record";

export const kintoneAllRecordsErrorToString = (
  e: KintoneAllRecordsError,
  chunkSize: number,
  records: KintoneRecord[],
  currentIndex: number
): string => {
  let errorMessage = "An error occurred while uploading records.\n";

  const totalMatch = e.message.match(
    /(?<numOfSuccess>\d+)\/(?<numOfTotal>\d+) records are processed successfully/
  );
  const numOfSuccess = Number(totalMatch?.groups?.numOfSuccess) + currentIndex;
  const numOfTotal = Number(totalMatch?.groups?.numOfTotal) + currentIndex;
  errorMessage += `${numOfSuccess}/${numOfTotal} records are processed successfully.\n`;

  errorMessage += kintoneRestAPIErrorToString(
    e.error,
    chunkSize,
    records,
    currentIndex
  );

  return errorMessage;
};

const kintoneRestAPIErrorToString = (
  e: KintoneRestAPIError,
  chunkSize: number,
  records: KintoneRecord[],
  currentIndex: number
): string => {
  let errorMessage = e.message;

  if (e.errors !== undefined) {
    const errors = e.errors as {
      [k: string]: { messages: string[] };
    };
    const orderedErrors = Object.entries(errors).sort((error1, error2) => {
      const index1 = error1[0].match(/records\[(\d+)\]/)?.at(1);
      const index2 = error2[0].match(/records\[(\d+)\]/)?.at(1);
      if (index1 === undefined) {
        return 1;
      }
      if (index2 === undefined) {
        return -1;
      }
      return Number(index1) - Number(index2);
    });
    for (const [key, value] of orderedErrors) {
      const bulkRequestIndex = e.bulkRequestIndex ?? 0;
      const indexMatch = key.match(/records\[(\d+)\]/);
      const index = Number(indexMatch?.at(1)) + bulkRequestIndex * chunkSize;
      errorMessage += `  An error occurred at records[${index}].\n`;
      for (const message of value.messages) {
        errorMessage += `    Cause: ${message}\n`;
      }
    }
  }
  return errorMessage;
};
