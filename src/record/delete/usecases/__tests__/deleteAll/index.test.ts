import { vi } from "vitest";
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
    apiClient.record.getAllRecordsWithId = vi.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.record.deleteAllRecords = vi.fn().mockResolvedValue([{}]);
    return expect(deleteAllRecords(apiClient, "1")).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    apiClient.record.getAllRecordsWithId = vi.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    const deleteAllRecordsMockFn = vi.fn().mockResolvedValue([{}]);
    apiClient.record.deleteAllRecords = deleteAllRecordsMockFn;
    const APP_ID = "1";

    await deleteAllRecords(apiClient, APP_ID);

    expect(deleteAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ id: 1 }],
    });
  });

  it("should throw error when API response is error", async () => {
    const error = new Error("client: error while deleting records");
    apiClient.record.getAllRecordsWithId = vi.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.record.deleteAllRecords = vi.fn().mockRejectedValue(error);

    await expect(deleteAllRecords(apiClient, "1")).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(DeleteAllRecordsError);
        expect(thrownError).toMatchObject({
          cause: error,
          detail: "No records are deleted.",
        });
        return true;
      },
    );
  });
});
