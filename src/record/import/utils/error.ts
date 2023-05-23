import type { KintoneAllRecordsErrorParser } from "../../error/types/parser";
import type { KintoneAllRecordsError } from "@kintone/rest-api-client";
import type { LocalRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";
import { KintoneRestAPIErrorParser } from "../../error";

export class ErrorParser implements KintoneAllRecordsErrorParser {
  private readonly error: KintoneAllRecordsError;
  private readonly chunkSize: number;
  private readonly records: LocalRecord[];
  private readonly offset: number;
  private readonly recordSchema: RecordSchema;

  constructor(
    error: KintoneAllRecordsError,
    chunkSize: number,
    records: LocalRecord[],
    offset: number,
    recordSchema: RecordSchema
  ) {
    this.error = error;
    this.chunkSize = chunkSize;
    this.records = records;
    this.offset = offset;
    this.recordSchema = recordSchema;
  }

  toString(): string {
    let errorMessage:string = KintoneRestAPIErrorParser.toString(this.error.error);

    if (this.error.error.errors !== undefined) {
      const errors = this.error.error.errors as {
        [k: string]: { messages: string[] };
      };
      const orderedErrors = Object.entries(errors).sort((error1, error2) => {
        const index1 = error1[0].match(/records\[(?<index>\d+)\]/)?.groups
          ?.index;
        const index2 = error2[0].match(/records\[(?<index>\d+)\]/)?.groups
          ?.index;
        if (index1 === undefined) {
          return 1;
        }
        if (index2 === undefined) {
          return -1;
        }
        return Number(index1) - Number(index2);
      });

      for (const [key, value] of orderedErrors) {
        const bulkRequestIndex = this.error.error.bulkRequestIndex ?? 0;
        const indexMatch = key.match(/records\[(?<index>\d+)\]/);
        const index =
          Number(indexMatch?.groups?.index) +
          bulkRequestIndex * this.chunkSize +
          this.offset;

        const formatInfo = this.records[index].metadata.format;
        const fieldCode = this._getFieldCodeByErrorKeyWithSchema(
          key,
          this.recordSchema
        );
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
  }

  private _getFieldCodeByErrorKeyWithSchema(
    errorKey: string,
    schema: RecordSchema
  ): string {
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
  }
}
