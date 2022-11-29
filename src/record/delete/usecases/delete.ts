import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecordForDeleteAllParameter } from "../../../kintone/types";
import { logger } from "../../../utils/log";
import { getAllRecordIds, evaluateRecords } from "../utils/record";
import { DeleteAllRecordsError } from "./error";

export const deleteAllRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  isCheckPermission: boolean
) => Promise<void> = async (apiClient, app, isCheckPermission) => {
  logger.info("Starting to delete all records...");
  const recordIds = await getAllRecordIds(apiClient, app);
  if (recordIds.length === 0) {
    logger.warn("The specified app does not have any records.");
    return;
  }

  let privilegedRecordIds: number[] = recordIds;
  let unprivilegedRecordIds: number[] = [];
  if (isCheckPermission) {
    const result = await evaluateRecords(apiClient, app, recordIds);
    privilegedRecordIds = result.privilegedRecordIds;
    unprivilegedRecordIds = result.unprivilegedRecordIds;
  }

  // TODO: Refactor this logic when kintone provide the API which returns the result of the evaluation about App permission.
  if (privilegedRecordIds.length === 0) {
    let errorMessage = "Failed to delete all records.\n";
    errorMessage += "No records are deleted.\n";
    errorMessage += "An error occurred while processing records.\n";
    errorMessage += "No privilege to proceed.";
    throw new Error(errorMessage);
  }

  const records: KintoneRecordForDeleteAllParameter[] = privilegedRecordIds.map(
    (recordId): KintoneRecordForDeleteAllParameter => {
      return {
        id: recordId,
      };
    }
  );

  try {
    const params = { app, records };
    await apiClient.record.deleteAllRecords(params);

    if (unprivilegedRecordIds.length === 0) {
      logger.info(`${recordIds.length} records are deleted successfully`);
      return;
    }

    logger.info(
      `${privilegedRecordIds.length}/${recordIds.length} records are deleted successfully`
    );
    logger.info(
      `Some records are not deleted because you do not have delete permission (ID: ${unprivilegedRecordIds.join(
        ", "
      )})`
    );
  } catch (e) {
    throw new DeleteAllRecordsError(e, records);
  }
};
