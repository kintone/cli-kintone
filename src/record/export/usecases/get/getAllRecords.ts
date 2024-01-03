import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecordForResponse } from "../../../../kintone/types";

// TODO: replace this function after @kintone/rest-api-client supports generator/stream
// eslint-disable-next-line func-style
export async function* getAllRecords(params: {
  apiClient: KintoneRestAPIClient;
  app: string;
  fields?: string[];
  condition?: string;
  orderBy?: string;
}): AsyncGenerator<KintoneRecordForResponse[], void, undefined> {
  const { condition, orderBy, ...rest } = params;
  if (!orderBy) {
    yield* getAllRecordsWithId({ ...rest, condition });
    return;
  }
  const conditionQuery = condition ? `${condition} ` : "";
  const query = `${conditionQuery}${orderBy ? `order by ${orderBy}` : ""}`;
  yield* getAllRecordsWithCursor({ ...rest, query });
}

// eslint-disable-next-line func-style
async function* getAllRecordsWithId(params: {
  apiClient: KintoneRestAPIClient;
  app: string;
  fields?: string[];
  condition?: string;
}): AsyncGenerator<KintoneRecordForResponse[], void, undefined> {
  const { fields: originalFields, ...rest } = params;
  let fields = originalFields;
  // Append $id if $id doesn't exist in fields
  if (fields && fields.length > 0 && fields.indexOf("$id") === -1) {
    fields = [...fields, "$id"];
  }
  yield* getAllRecordsRecursiveWithId({ ...rest, fields }, "0");
}

// eslint-disable-next-line func-style
async function* getAllRecordsRecursiveWithId(
  params: {
    apiClient: KintoneRestAPIClient;
    app: string;
    fields?: string[];
    condition?: string;
  },
  id: string,
): AsyncGenerator<KintoneRecordForResponse[], void, undefined> {
  const GET_RECORDS_LIMIT = 500;

  const { apiClient, condition, ...rest } = params;
  const conditionQuery = condition ? `(${condition}) and ` : "";

  let lastId = id;
  while (true) {
    const query = `${conditionQuery}$id > ${lastId} order by $id asc limit ${GET_RECORDS_LIMIT}`;
    const result = await apiClient.record.getRecords({ ...rest, query });
    yield result.records;

    if (result.records.length < GET_RECORDS_LIMIT) {
      break;
    }

    const lastRecord = result.records[result.records.length - 1];
    if (lastRecord.$id.type === "__ID__") {
      lastId = lastRecord.$id.value;
    } else {
      throw new Error(
        "Missing `$id` in `getRecords` response. This error is likely caused by a bug in Kintone REST API Client. Please file an issue.",
      );
    }
  }
}

// eslint-disable-next-line func-style
async function* getAllRecordsWithCursor(params: {
  apiClient: KintoneRestAPIClient;
  app: string;
  fields?: string[];
  query?: string;
}): AsyncGenerator<KintoneRecordForResponse[], void, undefined> {
  const { apiClient, ...rest } = params;
  const { id } = await apiClient.record.createCursor(rest);
  try {
    while (true) {
      const result = await apiClient.record.getRecordsByCursor({ id });
      yield result.records;
      if (!result.next) {
        break;
      }
    }
  } catch (error) {
    await apiClient.record.deleteCursor({ id });
    throw error;
  }
}
