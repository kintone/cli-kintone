import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecordForResponse } from "../../../kintone/types";

const CHUNK_SIZE = 100;

export const getAllRecordIds: (
  apiClient: KintoneRestAPIClient,
  app: string
) => Promise<number[]> = async (apiClient, app) => {
  const params = { app, fields: ["$id"] };
  const kintoneRecords = await apiClient.record.getAllRecordsWithId(params);
  if (!kintoneRecords || kintoneRecords.length === 0) {
    return [];
  }

  return kintoneRecords.map((record: KintoneRecordForResponse): number => {
    const idValue = record.$id.value as string;
    return parseInt(idValue, 10);
  });
};

export const evaluateRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordIds: number[]
) => Promise<{
  privilegedRecordIds: number[];
  unprivilegedRecordIds: number[];
}> = async (apiClient, app, recordIds) => {
  let numOfEvaluatedRecords = 0;
  let evaluationRecordIds = [];
  const unprivilegedRecordIds: number[] = [];
  const privilegedRecordIds: number[] = [];

  if (recordIds.length === 0) {
    return {
      privilegedRecordIds,
      unprivilegedRecordIds,
    };
  }

  do {
    evaluationRecordIds = recordIds.slice(
      numOfEvaluatedRecords,
      numOfEvaluatedRecords + CHUNK_SIZE
    );
    const response = await apiClient.app.evaluateRecordsAcl({
      app,
      ids: evaluationRecordIds,
    });
    const rights = response.rights;
    for (const right of rights) {
      if (right.record.deletable) {
        privilegedRecordIds.push(Number(right.id));
      } else {
        unprivilegedRecordIds.push(Number(right.id));
      }
    }
    numOfEvaluatedRecords += CHUNK_SIZE;
  } while (
    evaluationRecordIds.length === CHUNK_SIZE &&
    numOfEvaluatedRecords < recordIds.length
  );

  return {
    privilegedRecordIds,
    unprivilegedRecordIds,
  };
};
