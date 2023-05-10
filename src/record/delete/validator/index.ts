import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber } from "../types/field";
import {
  isValidRecordNumber,
  hasAppCode,
  getAllRecordIds,
  getRecordIdFromRecordNumber,
} from "../usecases/deleteByRecordNumber/record";

import { ErrorHandler } from "./errorHandler";
import { ValidatorError } from "./error";

export const validateRecordNumbers: (
  apiClient: KintoneRestAPIClient,
  app: string,
  appCode: string,
  recordNumbers: RecordNumber[]
) => Promise<void> = async (apiClient, app, appCode, recordNumbers) => {
  const validValues: string[] = [];
  const errorHandler = new ErrorHandler();
  const hasAppCodePrevious = hasAppCode(recordNumbers[0].value, appCode);
  const allRecordIds = await getAllRecordIds(apiClient, app);
  recordNumbers.forEach((recordNumber) => {
    const value = recordNumber.value;
    if (value.length === 0 || !isValidRecordNumber(value, appCode)) {
      errorHandler.addInvalidValueError(recordNumber);
      return;
    }

    const _hasAppCode = hasAppCode(value, appCode);
    if (_hasAppCode !== hasAppCodePrevious) {
      throw new ValidatorError(
        "The record number should not be mixed with those with and without app code"
      );
    }

    if (validValues.indexOf(value) > -1) {
      errorHandler.addDuplicatedError(recordNumber);
      return;
    }

    if (
      allRecordIds.indexOf(
        getRecordIdFromRecordNumber(recordNumber, appCode)
      ) === -1
    ) {
      errorHandler.addNotExistsError(recordNumber);
      return;
    }

    validValues.push(value);
  });

  if (errorHandler.hasError()) {
    throw errorHandler.generateError();
  }
};
