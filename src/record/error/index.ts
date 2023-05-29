import { CliKintoneError } from "../../utils/error";
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

export class RunError extends CliKintoneError {
  constructor(error: unknown) {
    super("", error);
  }
}
