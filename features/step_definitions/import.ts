import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";
import type { SupportedEncoding } from "../utils/helper";
import { SUPPORTED_ENCODING } from "../utils/helper";
import path from "path";

Given(
  "The CSV file {string} with content as below:",
  async function (filePath: string, table) {
    const csvObject = this.replacePlaceholdersInRawDataTables(table.raw());
    await this.generateCsvFile(csvObject, { filePath });
  },
);

Given(
  "The CSV file {string} with {string} encoded content as below:",
  async function (filePath: string, encoding: SupportedEncoding, table) {
    if (!SUPPORTED_ENCODING.includes(encoding)) {
      throw new Error(`The encoding ${encoding} is not supported`);
    }

    await this.generateCsvFile(table.raw(), { filePath, encoding });
  },
);

Given(
  "I have a file {string} with content: {string}",
  async function (filePath: string, content: string) {
    await this.generateFile(content, filePath);
  },
);

Then(
  "The app {string} should have records as below:",
  function (appKey, table) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    const fields = table.raw()[0].join(",");
    let command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --fields ${fields}`;
    if (appCredential.guestSpaceId && appCredential.guestSpaceId.length > 0) {
      command += ` --guest-space-id ${appCredential.guestSpaceId}`;
    }
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(
        `Getting records failed. Error: \n${this.response.stderr}`,
      );
    }

    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.shift();
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => (field ? `"${field}"` : ""))
        .join(",");
      assert.match(this.response.stdout, new RegExp(`${values}`));
    });
  },
);

Then(
  "The app {string} with table field should has records as below:",
  function (appKey, table) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    const allFields = table.raw()[0];
    const regex = /^[a-zA-Z0-9_]+$/;
    const filteredFields = allFields
      .filter((field: string) => regex.test(field))
      .join(",");
    const command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --fields ${filteredFields}`;
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(
        `Getting records failed. Error: \n${this.response.stderr}`,
      );
    }

    const records = table.raw();
    records.shift();
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => {
          if (!field) {
            return "";
          }

          if (field === "*") {
            return `\\${field}`;
          }

          return `"${field}"`;
        })
        .join(",");
      assert.match(this.response.stdout, new RegExp(`${values}`));
    });
  },
);

Then(
  "The app {string} should have attachments as below:",
  function (appKey, table) {
    const columns: string[] = table.raw()[0];
    const requiredColumns = [
      "RecordIndex",
      "AttachmentFieldCode",
      "File",
      "Content",
    ];
    requiredColumns.forEach((requiredColumn) => {
      if (!columns.includes(requiredColumn)) {
        throw new Error(`The table should have ${requiredColumn} column.`);
      }
    });

    const attachmentDir = "attachments";
    const credential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    const command = `record export --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --attachments-dir ${this.workingDir}/${attachmentDir}`;
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(
        `Getting records failed. Error: \n${this.response.stderr}`,
      );
    }

    const records: [{ [key: string]: string }] = table.hashes();
    const recordNumbers = this.getRecordNumbersByAppKey(appKey);
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const recordNumber =
        recordNumbers[record.RecordIndex as unknown as number];
      const actualFilePath = `${this.workingDir}/${attachmentDir}/${record.AttachmentFieldCode}-${recordNumber}/${record.File}`;

      assert.ok(
        fs.existsSync(actualFilePath),
        `The file "${actualFilePath}" is not found`,
      );

      const actualContent = fs.readFileSync(actualFilePath, "utf8");
      assert.equal(
        actualContent,
        record.Content,
        `The content of the file "${actualFilePath}" does not matched.`,
      );
    }
  },
);

Then("The app {string} should have no attachments", function (appKey) {
  const attachmentDir = fs.mkdtempSync(
    path.join(this.workingDir, "no-attachments-"),
  );
  const credential = this.getAppCredentialByAppKey(appKey);
  const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
  const command = `record export --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --attachments-dir ${attachmentDir}`;
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${this.response.stderr}`);
  }

  assert.equal(
    fs.readdirSync(attachmentDir, { recursive: true }).length,
    0,
    `The directory ${attachmentDir} should be empty`,
  );
});
