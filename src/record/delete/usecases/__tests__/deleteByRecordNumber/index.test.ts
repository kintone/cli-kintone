import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { deleteByRecordNumber } from "../../deleteByRecordNumber";

describe("deleteRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it("should not fail", () => {
    apiClient.app.getApp = jest.fn().mockResolvedValue({ code: "appcode" });
    apiClient.record.deleteAllRecords = jest.fn().mockResolvedValue([{}]);
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
      },
    ]);
    return expect(
      deleteByRecordNumber(apiClient, "1", [{ value: "appcode-1" }]),
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const deleteAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.deleteAllRecords = deleteAllRecordsMockFn;
    apiClient.app.getApp = jest.fn().mockResolvedValue({ code: "appcode" });
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
      },
      {
        $id: { value: "2" },
      },
    ]);
    const APP_ID = "1";

    await deleteByRecordNumber(apiClient, APP_ID, [
      { value: "appcode-1" },
      { value: "appcode-2" },
    ]);

    expect(deleteAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ id: 1 }, { id: 2 }],
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("Failed to delete records");
    apiClient.app.getApp = jest.fn().mockResolvedValue({ code: "appcode" });
    apiClient.record.deleteAllRecords = jest.fn().mockRejectedValueOnce(error);
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([]);
    return expect(
      deleteByRecordNumber(apiClient, "1", [{ value: "appcode-1" }]),
    ).rejects.toThrow("Failed to delete records");
  });
});
