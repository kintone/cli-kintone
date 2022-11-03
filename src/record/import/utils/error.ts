import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { KintoneRecord } from "../types/record";
import { RecordSchema } from "../types/schema";

export const parseKintoneAllRecordsError = (
  e: KintoneAllRecordsError
): { numOfSuccess: number; numOfTotal: number } => {
  const totalMatch = e.message.match(
    /(?<numOfSuccess>\d+)\/(?<numOfTotal>\d+) records are processed successfully/
  );
  const numOfSuccess = Number(totalMatch?.groups?.numOfSuccess);
  const numOfTotal = Number(totalMatch?.groups?.numOfTotal);
  return { numOfSuccess, numOfTotal };
};

export const kintoneAllRecordsErrorToString = (
  e: KintoneAllRecordsError,
  chunkSize: number,
  records: KintoneRecord[],
  numOfSuccess: number,
  recordSchema: RecordSchema
): string => {
  let errorMessage = "An error occurred while uploading records.\n";

  errorMessage += kintoneRestAPIErrorToString(
    e.error,
    chunkSize,
    records,
    numOfSuccess,
    recordSchema
  );

  return errorMessage;
};

const kintoneRestAPIErrorToString = (
  e: KintoneRestAPIError,
  chunkSize: number,
  records: KintoneRecord[],
  offset: number,
  recordSchema: RecordSchema
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
      const index =
        Number(indexMatch?.groups?.index) +
        bulkRequestIndex * chunkSize +
        offset;

      const formatInfo = records[index].metadata.format;
      const fieldCode = getFieldCodeByErrorKeyWithSchema(key, recordSchema);
      if (formatInfo.firstRowIndex === formatInfo.lastRowIndex) {
        errorMessage += `  An error occurred on ${fieldCode} at row ${
          formatInfo.lastRowIndex + 1
        }.\n`;
      } else {
        errorMessage += `  An error occurred on ${fieldCode} at rows from ${
          formatInfo.firstRowIndex + 1
        } to ${formatInfo.lastRowIndex + 1}.\n`;
      }

      for (const message of value.messages) {
        errorMessage += `    Cause: ${message}\n`;
      }
    }
  }
  return errorMessage;
};

/**
 * Parse error key to string array. For example:
 * Input: records[0].Table.value[1].value.table_text_0.value
 * Output: ['records', '0', 'Table', 'value', '1', 'value', 'table_text_0', 'value']
 * @param {string} errorKey
 */
const parseErrorKey = (errorKey: string): string[] => {
  return errorKey.split(/[[\].]+/);
};

const getFieldCodeByErrorKeyWithSchema = (
  errorKey: string,
  schema: RecordSchema
) => {
  const parsedErrorKey = parseErrorKey(errorKey);
  const fieldCodeIndex = 2;
  const fieldCode = parsedErrorKey[fieldCodeIndex];

  const field = schema.fields.find((f) => f.code === fieldCode);
  if (field === undefined) {
    return fieldCode;
  }

  switch (field.type) {
    case "SUBTABLE": {
      const fieldCodeIndexOfTableColumn = 6;
      return parsedErrorKey[fieldCodeIndexOfTableColumn];
    }
    default: {
      return fieldCode;
    }
  }
};
