import { KintoneRestAPIError } from "@kintone/rest-api-client";
import type { KintoneAllRecordsErrorParser } from "./types/parser";

export const kintoneAllRecordsErrorToString = (
  errorParser?: KintoneAllRecordsErrorParser
): string => {
  let errorMessage = "An error occurred while processing records.\n";

  if (errorParser) {
    errorMessage += errorParser.toString();
  }

  return errorMessage;
};

export class KintoneRestAPIErrorParser {

  static toString(error:KintoneRestAPIError): string {
    switch (error.code) {
      case "GAIA_IL23":
        return "please specify --guest-space-id option. \n" 
      default:
          return `${error.message}\n`;
    }
  }
}