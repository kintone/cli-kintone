import type { KintoneRestAPIError } from "@kintone/rest-api-client";
import type { LocalRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

/** *
 * @param error
 * @param chunkSize Chunk size of a single request. See https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L16
 * @param records Record of current chunk divided by rest-api-client
 * @param recordSchema
 */
export const parseKintoneRestAPIError = (
  error: KintoneRestAPIError,
  chunkSize: number,
  records: LocalRecord[],
  recordSchema: RecordSchema
): string => {
  let errorMessage: string = `${error.message}\n`;

  if (error.errors !== undefined) {
    const errors = error.errors as {
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
      const bulkRequestIndex = error.bulkRequestIndex ?? 0;
      const indexMatch = key.match(/records\[(?<index>\d+)\]/);
      const recordIndex =
        Number(indexMatch?.groups?.index) + bulkRequestIndex * chunkSize;
      const fieldCode = getFieldCodeByErrorKeyWithSchema(key, recordSchema);
      const errorIndexMessage = generateErrorIndexMessage(records, recordIndex);
      errorMessage += `  An error occurred on ${fieldCode} ${errorIndexMessage}\n`;

      for (const message of value.messages) {
        errorMessage += `    Cause: ${message}\n`;
      }
    }
  }
  return errorMessage;
};

const generateErrorIndexMessage = (
  records: LocalRecord[],
  recordIndex: number
): string => {
  let errorMessage = "";
  if (!records[recordIndex]) {
    return errorMessage;
  }

  const formatInfo = records[recordIndex].metadata.format;
  if (formatInfo.firstRowIndex === formatInfo.lastRowIndex) {
    errorMessage += `at row ${formatInfo.lastRowIndex + 1}.`;
  } else {
    errorMessage += `at rows from ${formatInfo.firstRowIndex + 1} to ${
      formatInfo.lastRowIndex + 1
    }.`;
  }

  return errorMessage;
};

const getFieldCodeByErrorKeyWithSchema = (
  errorKey: string,
  schema: RecordSchema
): string => {
  /**
   * Parse error key to string array. For example:
   * Input: records[0].Table.value[1].value.table_text_0.value
   * Output: ['records', '0', 'Table', 'value', '1', 'value', 'table_text_0', 'value']
   */
  const parsedErrorKey = errorKey.split(/[[\].]+/);
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
