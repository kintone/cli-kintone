import { KintoneRestAPIErrorParser } from "../../error";
import type { KintoneAllRecordsErrorParser } from "../../error/types/parser";
import type { KintoneAllRecordsError } from "@kintone/rest-api-client";

export class ErrorParser implements KintoneAllRecordsErrorParser {
  private readonly error: KintoneAllRecordsError;

  constructor(error: KintoneAllRecordsError) {
    this.error = error;
  }

  toString(): string {
    return KintoneRestAPIErrorParser.toString(this.error.error);
  }
}
