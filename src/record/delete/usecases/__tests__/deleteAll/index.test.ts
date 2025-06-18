import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { deleteAllRecords } from "../../deleteAll";
import { DeleteAllRecordsError } from "../../deleteAll/error";

describe("deleteAllRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it("should not fail", () => {
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.record.deleteAllRecords = jest.fn().mockResolvedValue([{}]);
    return expect(deleteAllRecords(apiClient, "1")).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    const deleteAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.deleteAllRecords = deleteAllRecordsMockFn;
    const APP_ID = "1";

    await deleteAllRecords(apiClient, APP_ID);

    expect(deleteAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ id: 1 }],
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("client: error while deleting records");
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.record.deleteAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(deleteAllRecords(apiClient, "1")).rejects.toThrow(
      DeleteAllRecordsError,
    );
  });
});
