import { vi } from "vitest";
import type { RecordSchema } from "../../../types/schema";
import type { LocalRecord } from "../../../types/record";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { addRecords } from "../../add";

import path from "path";

import * as canUploadFiles from "./fixtures/can_upload_files";
import * as canUploadFilesInSubtable from "./fixtures/can_upload_files_in_subtable";
import { AddRecordsError } from "../../add/error";
import { inputRecords } from "./fixtures/can_upload_files";
import { LocalRecordRepositoryMock } from "../../../repositories/localRecordRepositoryMock";

describe("addRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it("should not fail", () => {
    apiClient.record.addAllRecords = vi.fn().mockResolvedValue([{}]);
    return expect(
      addRecords(
        apiClient,
        "1",
        new LocalRecordRepositoryMock([], "csv"),
        { fields: [] },
        { attachmentsDir: "" },
      ),
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const addAllRecordsMockFn = vi.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;
    const ATTACHMENTS_DIR = "";
    const APP_ID = "1";
    const RECORDS: LocalRecord[] = [
      {
        data: { number: { value: "1" } },
        metadata: {
          format: { type: "csv", firstRowIndex: 0, lastRowIndex: 0 },
        },
      },
    ];
    const SCHEMA: RecordSchema = {
      fields: [
        {
          type: "NUMBER",
          code: "number",
          label: "number",
          noLabel: false,
          required: true,
          minValue: "",
          maxValue: "",
          digit: false,
          unique: true,
          defaultValue: "",
          displayScale: "",
          unit: "",
          unitPosition: "BEFORE",
        },
      ],
    };
    const repository = new LocalRecordRepositoryMock(RECORDS, "csv");

    await addRecords(apiClient, APP_ID, repository, SCHEMA, {
      attachmentsDir: ATTACHMENTS_DIR,
    });

    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ number: { value: "1" } }],
    });
  });

  it("should includes a Record Number field", async () => {
    const addAllRecordsMockFn = vi.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;
    const APP_ID = "1";
    const RECORDS: LocalRecord[] = [
      {
        data: { recordNumber: { value: "1" }, number: { value: "1" } },
        metadata: {
          format: { type: "csv", firstRowIndex: 0, lastRowIndex: 0 },
        },
      },
    ];
    const SCHEMA: RecordSchema = {
      fields: [
        {
          type: "RECORD_NUMBER",
          code: "recordNumber",
          label: "recordNumber",
          noLabel: false,
        },
        {
          type: "NUMBER",
          code: "number",
          label: "number",
          noLabel: false,
          required: true,
          minValue: "",
          maxValue: "",
          digit: false,
          unique: true,
          defaultValue: "",
          displayScale: "",
          unit: "",
          unitPosition: "BEFORE",
        },
      ],
    };
    const repository = new LocalRecordRepositoryMock(RECORDS, "csv");

    await addRecords(apiClient, APP_ID, repository, SCHEMA, {});

    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: [{ recordNumber: { value: "1" }, number: { value: "1" } }],
    });
  });

  it("should throw error when attachmentsDir is NOT given", () => {
    const APP_ID = "1";

    return expect(
      addRecords(
        apiClient,
        APP_ID,
        canUploadFiles.input,
        canUploadFiles.schema,
        {},
      ),
    ).rejects.toThrow(
      new AddRecordsError(
        new Error("--attachments-dir option is required."),
        inputRecords,
        0,
        canUploadFiles.schema,
      ),
    );
  });

  it("should upload files correctly when attachmentsDir is given", async () => {
    const uploadFileMockFn = vi
      .fn()
      .mockReturnValueOnce({ fileKey: "abcde" })
      .mockReturnValueOnce({ fileKey: "fghij" });
    apiClient.file.uploadFile = uploadFileMockFn;
    const addAllRecordsMockFn = vi.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";

    await addRecords(
      apiClient,
      APP_ID,
      canUploadFiles.input,
      canUploadFiles.schema,
      {
        attachmentsDir: ATTACHMENTS_DIR,
      },
    );

    // apiClient.file.uploadFile should be called with correct filePath
    const fileInfos = canUploadFiles.inputRecords[0].data.attachment
      .value as Array<{
      localFilePath: string;
    }>;
    expect(uploadFileMockFn.mock.calls[0][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[0].localFilePath),
      },
    });
    expect(uploadFileMockFn.mock.calls[1][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[1].localFilePath),
      },
    });

    // records should contain fileKeys
    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: canUploadFiles.expected,
    });
  });

  it("should upload files correctly when attachmentsDir is given and with subtable", async () => {
    const uploadFileMockFn = vi
      .fn()
      .mockReturnValueOnce({ fileKey: "abcde" })
      .mockReturnValueOnce({ fileKey: "fghij" });
    apiClient.file.uploadFile = uploadFileMockFn;
    const addAllRecordsMockFn = vi.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";

    await addRecords(
      apiClient,
      APP_ID,
      canUploadFilesInSubtable.input,
      canUploadFilesInSubtable.schema,
      {
        attachmentsDir: ATTACHMENTS_DIR,
      },
    );

    // apiClient.file.uploadFile should be called with correct filePath
    const fileInfos = canUploadFiles.inputRecords[0].data.attachment
      .value as Array<{
      localFilePath: string;
    }>;
    expect(uploadFileMockFn.mock.calls[0][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[0].localFilePath),
      },
    });
    expect(uploadFileMockFn.mock.calls[1][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[1].localFilePath),
      },
    });

    // records should contain fileKeys
    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: canUploadFilesInSubtable.expected,
    });
  });
});
