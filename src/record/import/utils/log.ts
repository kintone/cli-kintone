import { AddRecordsError } from "../usecases/add/error";
import { UpsertRecordsError } from "../usecases/upsert/error";
import { ParserError } from "../parsers/error";

const logger = console.error;

export const printError = (error: unknown): void => {
  if (error instanceof Error) {
    if (error instanceof AddRecordsError) {
      logger(error.toString());
    } else if (error instanceof UpsertRecordsError) {
      logger(error.toString());
    } else if (error instanceof ParserError) {
      logger(error.toString());
    } else {
      logger(error);
    }
  } else {
    logger(error);
  }
};
