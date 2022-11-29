import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { evaluateRecords } from "../record";

describe("evaluateRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it("should return correct value", async () => {
    const recordIds = [1, 2, 3];
    const privilegedRecordIds = [1, 3];
    const unprivilegedRecordIds = [2];
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
        {
          id: 2,
          record: {
            viewable: true,
            editable: true,
            deletable: false,
          },
        },
        {
          id: 3,
          record: {
            viewable: true,
            editable: true,
            deletable: true,
          },
        },
      ],
    });
    const actual = await evaluateRecords(apiClient, "1", recordIds);
    return expect(actual).toEqual({
      privilegedRecordIds,
      unprivilegedRecordIds,
    });
  });
});
