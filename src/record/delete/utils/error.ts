import type { KintoneAllRecordsErrorParser } from "../../error/types/parser.js";
import type { KintoneAllRecordsError } from "@kintone/rest-api-client";

export class ErrorParser implements KintoneAllRecordsErrorParser {
  private readonly error: KintoneAllRecordsError;

  constructor(error: KintoneAllRecordsError) {
    this.error = error;
  }

  toString(): string {
    return this.error.error.message;
  }
}
