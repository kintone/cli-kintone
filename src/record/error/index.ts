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
