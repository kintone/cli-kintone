import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { KintoneRecord } from "../types/record";

export const parseKintoneAllRecordsError = (
  e: KintoneAllRecordsError
): { numOfSuccess: number; numOfTotal: number } => {
  const totalMatch = e.message.match(
    /(?<numOfSuccess>\d+)\/(?<numOfTotal>\d+) records are processed successfully/
  );
  if (totalMatch?.groups?.numOfSuccess === undefined) {
    throw new Error(
      "Missing numOfSuccess in error message of KintoneAllRecordsError. This error is likely caused by a bug in cli-kintone. Please file an issue."
    );
  }
  if (totalMatch?.groups?.numOfTotal === undefined) {
    throw new Error(
      "Missing numOfTotal in error message of KintoneAllRecordsError. This error is likely caused by a bug in cli-kintone. Please file an issue."
    );
  }
  const numOfSuccess = Number(totalMatch?.groups?.numOfSuccess);
  const numOfTotal = Number(totalMatch?.groups?.numOfTotal);
  return { numOfSuccess, numOfTotal };
};

export const kintoneAllRecordsErrorToString = (
  e: KintoneAllRecordsError,
  chunkSize: number,
  records: KintoneRecord[],
  numOfSuccess: number
): string => {
  let errorMessage = "An error occurred while uploading records.\n";

  errorMessage += kintoneRestAPIErrorToString(
    e.error,
    chunkSize,
    records,
    numOfSuccess
  );

  return errorMessage;
};

const kintoneRestAPIErrorToString = (
  e: KintoneRestAPIError,
  chunkSize: number,
  records: KintoneRecord[],
  offset: number
): string => {
  let errorMessage = e.message + "\n";

  if (e.errors !== undefined) {
    const errors = e.errors as {
      [k: string]: { messages: string[] };
    };
    const orderedErrors = Object.entries(errors).sort((error1, error2) => {
      const index1 = error1[0].match(/records\[(?<index>\d+)\]/)?.groups?.index;
      const index2 = error2[0].match(/records\[(?<index>\d+)\]/)?.groups?.index;
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
      const indexMatch = key.match(/records\[(?<index>\d+)\]/);
      if (indexMatch?.groups?.index === undefined) {
        throw new Error(
          "Missing record index in error message of KintoneRestAPIError. This error is likely caused by a bug in cli-kintone. Please file an issue."
        );
      }
      const index =
        Number(indexMatch?.groups?.index) +
        bulkRequestIndex * chunkSize +
        offset;

      const formatInfo = records[index].metadata.format;
      if (formatInfo.firstRowIndex === formatInfo.lastRowIndex) {
        errorMessage += `  An error occurred at row ${
          formatInfo.lastRowIndex + 1
        }.\n`;
      } else {
        errorMessage += `  An error occurred at rows from ${
          formatInfo.firstRowIndex + 1
        } to ${formatInfo.lastRowIndex}.\n`;
      }

      for (const message of value.messages) {
        errorMessage += `    Cause: ${message}\n`;
      }
    }
  }
  return errorMessage;
};
