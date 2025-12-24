import { vi } from "vitest";
import type * as Fields from "../../../types/field";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { promises as fs } from "fs";

import os from "os";
import path from "path";
import { getRecords, NO_RECORDS_WARNING } from "../../get";

import * as caseCanGetRecords from "./fixtures/can_get_records";
import * as caseCanDownloadFiles from "./fixtures/can_download_files";
import * as caseCanDownloadFilesInSubtable from "./fixtures/can_download_files_in_subtable";
import * as caseCanDownloadFilesIncludingSpecialCharacters from "./fixtures/can_download_files_including_special_characters";
import * as caseCanDownloadFilesIncludingSpecialCharactersInSubTable from "./fixtures/can_download_files_including_special_characters_in_subtable";
import { LocalRecordRepositoryMock } from "../../../repositories/localRecordRepositoryMock";
import { logger } from "../../../../../utils/log";
import type { RecordSchema } from "../../../types/schema";

type KintoneRecord = Awaited<
  ReturnType<KintoneRestAPIClient["record"]["getAllRecords"]>
>[number];

describe("getRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  it("should not be failed", () => {
    const getAllRecordsMockFn = vi.fn(async function* () {
      yield [
        {
          $id: { type: "__ID__", value: "1" },
          value1: {
            type: "SINGLE_LINE_TEXT",
            value: "",
          },
        },
      ] as KintoneRecord[];
    });
    const repositoryMock = new LocalRecordRepositoryMock();
    return expect(
      getRecords(
        apiClient,
        "1",
        repositoryMock,
        caseCanGetRecords.schema,
        {},
        getAllRecordsMockFn,
      ),
    ).resolves.not.toThrow();
  });

  it("can get records", async () => {
    const records = caseCanGetRecords.input;
    const expectedRecords = caseCanGetRecords.expected;
    const schema = caseCanGetRecords.schema;
    const repositoryMock = new LocalRecordRepositoryMock();
    const getAllRecordsMockFn = vi.fn(async function* () {
      yield records;
    });
    await getRecords(
      apiClient,
      "1",
      repositoryMock,
      schema,
      {},
      getAllRecordsMockFn,
    );
    expect(repositoryMock.receivedRecords()).toStrictEqual(expectedRecords);
  });

  it("can download files to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFiles.input;
    const expectedRecords = caseCanDownloadFiles.expected;
    const schema = caseCanDownloadFiles.schema;
    const repositoryMock = new LocalRecordRepositoryMock();

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
    const getAllRecordsMockFn = vi.fn(async function* () {
      yield kintoneRecords;
    });
    apiClient.file.downloadFile = vi.fn().mockResolvedValue(testFileData);
    await getRecords(
      apiClient,
      "1",
      repositoryMock,
      schema,
      {
        attachmentsDir: tempDir,
      },
      getAllRecordsMockFn,
    );
    expect(repositoryMock.receivedRecords()).toStrictEqual(expectedRecords);

    const attachmentValue = (expectedRecords[0].attachment as Fields.File)
      .value;
    for (const attachment of attachmentValue) {
      if (!attachment.localFilePath) {
        throw new Error("attachment.localFilePath is null or undefined");
      }
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath),
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });

  it("can download files in subtable to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFilesInSubtable.input;
    const expectedRecords = caseCanDownloadFilesInSubtable.expected;
    const schema = caseCanDownloadFilesInSubtable.schema;
    const repositoryMock = new LocalRecordRepositoryMock();

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
    const getAllRecordsMockFn = vi.fn(async function* () {
      yield kintoneRecords;
    });
    apiClient.file.downloadFile = vi.fn().mockResolvedValue(testFileData);
    await getRecords(
      apiClient,
      "1",
      repositoryMock,
      schema,
      {
        attachmentsDir: tempDir,
      },
      getAllRecordsMockFn,
    );
    expect(repositoryMock.receivedRecords()).toStrictEqual(expectedRecords);

    const attachmentValue = (
      (expectedRecords[0].subTable as Fields.Subtable).value[0].value
        .subTableFile as Fields.File
    ).value;
    for (const attachment of attachmentValue) {
      if (!attachment.localFilePath) {
        throw new Error("attachment.localFilePath is null or undefined");
      }
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath),
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });

  (process.platform === "win32" ? it : it.skip)(
    "can download files including special characters",
    async () => {
      const kintoneRecords =
        caseCanDownloadFilesIncludingSpecialCharacters.input;
      const expectedRecords =
        caseCanDownloadFilesIncludingSpecialCharacters.expected;
      const schema = caseCanDownloadFilesIncludingSpecialCharacters.schema;
      const repositoryMock = new LocalRecordRepositoryMock();

      const testFileData = "test data";
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
      const getAllRecordsMockFn = vi.fn(async function* () {
        yield kintoneRecords;
      });
      apiClient.file.downloadFile = vi.fn().mockResolvedValue(testFileData);
      await getRecords(
        apiClient,
        "1",
        repositoryMock,
        schema,
        {
          attachmentsDir: tempDir,
        },
        getAllRecordsMockFn,
      );
      expect(repositoryMock.receivedRecords()).toStrictEqual(expectedRecords);

      const attachmentValue = (expectedRecords[0].attachment as Fields.File)
        .value;
      for (const attachment of attachmentValue) {
        if (!attachment.localFilePath) {
          throw new Error("attachment.localFilePath is null or undefined");
        }
        const downloadFile = await fs.readFile(
          path.join(tempDir, attachment.localFilePath),
        );
        expect(downloadFile.toString()).toBe(testFileData);
      }
    },
  );

  (process.platform === "win32" ? it : it.skip)(
    "can download files including special characters in subTable",
    async () => {
      const kintoneRecords =
        caseCanDownloadFilesIncludingSpecialCharactersInSubTable.input;
      const expectedRecords =
        caseCanDownloadFilesIncludingSpecialCharactersInSubTable.expected;
      const schema =
        caseCanDownloadFilesIncludingSpecialCharactersInSubTable.schema;
      const repositoryMock = new LocalRecordRepositoryMock();

      const testFileData = "test data";
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
      const getAllRecordsMockFn = vi.fn(async function* () {
        yield kintoneRecords;
      });
      apiClient.file.downloadFile = vi.fn().mockResolvedValue(testFileData);
      await getRecords(
        apiClient,
        "1",
        repositoryMock,
        schema,
        {
          attachmentsDir: tempDir,
        },
        getAllRecordsMockFn,
      );
      expect(repositoryMock.receivedRecords()).toStrictEqual(expectedRecords);

      const attachmentValue = (
        (expectedRecords[0].subTable as Fields.Subtable).value[0].value
          .subTableFile as Fields.File
      ).value;
      for (const attachment of attachmentValue) {
        if (!attachment.localFilePath) {
          throw new Error("attachment.localFilePath is null or undefined");
        }
        const downloadFile = await fs.readFile(
          path.join(tempDir, attachment.localFilePath),
        );
        expect(downloadFile.toString()).toBe(testFileData);
      }
    },
  );

  it("should throw error when API response is error", () => {
    const repositoryMock = new LocalRecordRepositoryMock();

    const error = new Error("error for test");
    // eslint-disable-next-line require-yield
    const getAllRecordsMockFn = vi.fn(async function* () {
      throw error;
    });
    return expect(
      getRecords(
        apiClient,
        "1",
        repositoryMock,
        caseCanGetRecords.schema,
        {},
        getAllRecordsMockFn,
      ),
    ).rejects.toThrow(error);
  });

  it("should show warning message if there is no records exist in the app or match the condition.", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {
      return true;
    });
    const loggerWarnMock = vi.spyOn(logger, "warn");
    const repositoryMock = new LocalRecordRepositoryMock();
    const getAllRecordsMockFn = vi.fn(async function* () {
      yield [];
    });

    await getRecords(
      apiClient,
      "999",
      repositoryMock,
      {} as RecordSchema,
      {},
      getAllRecordsMockFn,
    );

    expect(loggerWarnMock).toHaveBeenCalledTimes(1);
    expect(loggerWarnMock).toHaveBeenCalledWith(NO_RECORDS_WARNING);
  });
});
