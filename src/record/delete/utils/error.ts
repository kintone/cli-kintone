import type { IParser } from "../../error/types/parser";
import type { KintoneRestAPIError } from "@kintone/rest-api-client";

export class ErrorParser implements IParser {
  private readonly error: KintoneRestAPIError;

  constructor(error: KintoneRestAPIError) {
    this.error = error;
  }

  toString(): string {
    return this.error.message;
  }
}
