import type * as Fields from "../../../types/field";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { promises as fs } from "fs";

import os from "os";
import path from "path";
import { getRecords } from "../../get";

import * as caseCanGetRecords from "./fixtures/can_get_records";
import * as caseCanDownloadFiles from "./fixtures/can_download_files";
import * as caseCanDownloadFilesInSubtable from "./fixtures/can_download_files_in_subtable";

describe("getRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  it("should not be failed", () => {
    apiClient.record.getAllRecords = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    return expect(
      getRecords(apiClient, "1", caseCanGetRecords.schema, {})
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getAllRecordsMockFn = jest.fn().mockResolvedValue([
      {
        $id: { value: "1" },
        value1: {
          values: "",
        },
      },
    ]);
    apiClient.record.getAllRecords = getAllRecordsMockFn;
    const APP_ID = "1";
    const CONDITION = 'Customer like "foo"';
    const ORDER_BY = "Customer desc";

    await getRecords(apiClient, APP_ID, caseCanGetRecords.schema, {
      condition: CONDITION,
      orderBy: ORDER_BY,
    });

    expect(getAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      condition: CONDITION,
      orderBy: ORDER_BY,
    });
  });

  it("can get records", async () => {
    const records = caseCanGetRecords.input;
    const expectedRecords = caseCanGetRecords.expected;
    const schema = caseCanGetRecords.schema;

    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    const actual = await getRecords(apiClient, "1", schema, {});
    expect(actual).toStrictEqual(expectedRecords);
  });

  it("can download files to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFiles.input;
    const expectedRecords = caseCanDownloadFiles.expected;
    const schema = caseCanDownloadFiles.schema;

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
    apiClient.record.getAllRecords = jest
      .fn()
      .mockResolvedValue(kintoneRecords);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await getRecords(apiClient, "1", schema, {
      attachmentsDir: tempDir,
    });
    expect(actual).toStrictEqual(expectedRecords);

    const attachmentValue = (expectedRecords[0].attachment as Fields.File)
      .value;
    for (const attachment of attachmentValue) {
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath!)
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });

  it("can download files in subtable to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFilesInSubtable.input;
    const expectedRecords = caseCanDownloadFilesInSubtable.expected;
    const schema = caseCanDownloadFilesInSubtable.schema;

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
    apiClient.record.getAllRecords = jest
      .fn()
      .mockResolvedValue(kintoneRecords);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await getRecords(apiClient, "1", schema, {
      attachmentsDir: tempDir,
    });
    expect(actual).toStrictEqual(expectedRecords);

    const attachmentValue = (
      (expectedRecords[0].subTable as Fields.Subtable).value[0].value
        .subTableFile as Fields.File
    ).value;
    for (const attachment of attachmentValue) {
      if (!attachment.localFilePath) {
        throw new Error("attachment.localFilePath is null or undefined");
      }
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath)
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });
  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.record.getAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(
      getRecords(apiClient, "1", caseCanGetRecords.schema, {})
    ).rejects.toThrow(error);
  });
});
