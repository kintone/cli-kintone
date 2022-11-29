import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { deleteAllRecords } from "../delete";

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
    apiClient.app.evaluateRecordsAcl = jest.fn().mockResolvedValue({
      rights: [
        {
          id: 1,
          record: {
            viewable: true,
            editable: true,
            deletable: true,
          },
        },
      ],
    });
    apiClient.record.deleteAllRecords = jest.fn().mockResolvedValue([{}]);
    return expect(
      deleteAllRecords(apiClient, "1", true)
    ).resolves.not.toThrow();
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
    apiClient.app.evaluateRecordsAcl = jest.fn().mockResolvedValue({
      rights: [
        {
          id: 1,
          record: {
            viewable: true,
            editable: true,
            deletable: true,
          },
        },
      ],
    });
    const deleteAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.deleteAllRecords = deleteAllRecordsMockFn;
    const APP_ID = "1";

    await deleteAllRecords(apiClient, APP_ID, true);

    expect(deleteAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ id: 1 }],
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("Failed to delete all records.");
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.app.evaluateRecordsAcl = jest.fn().mockResolvedValue({
      rights: [
        {
          id: 1,
          record: {
            viewable: true,
            editable: true,
            deletable: true,
          },
        },
      ],
    });
    apiClient.record.deleteAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(deleteAllRecords(apiClient, "1", true)).rejects.toThrow(
      error
    );
  });
});
