import type { IParser } from "./types/parser";

export const kintoneAllRecordsErrorToString = (
  errorParser?: IParser
): string => {
  let errorMessage = "An error occurred while processing records.\n";

  if (errorParser) {
    errorMessage += errorParser.toString();
  }

  return errorMessage;
};
