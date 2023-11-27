import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";
import { replacePlaceholdersInDataTables } from "../utils/helper";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    const csvObject = replacePlaceholdersInDataTables(table.raw(), this.var);
    await this.generateCsvFile(csvObject, filePath);
  },
);

Given(
  "The csv file {string} with the same Record_number in the app {string} as below:",
  async function (filePath: string, appKey: string, table) {
    const recordNumbers = this.getRecordNumbersByAppKey(appKey);
    const csvObject: string[][] = table
      .raw()
      .map((row: string[], index: number) => {
        if (index === 0) {
          return ["Record_number", ...row];
        }

        return [recordNumbers[index - 1], ...row];
      });

    await this.generateCsvFile(csvObject, filePath);
  },
);

Given(
  "I have a file {string} with content: {string}",
  async function (filePath: string, content: string) {
    await this.generateFile(content, filePath);
  },
);

Then("The app {string} should has records as below:", function (appKey, table) {
  const appCredential = this.getAppCredentialByAppKey(appKey);
  const fields = table.raw()[0].join(",");
  const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
  let command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --fields ${fields}`;
  if (appCredential.guestSpaceId && appCredential.guestSpaceId.length > 0) {
    command += ` --guest-space-id ${appCredential.guestSpaceId}`;
  }
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${this.response.stderr}`);
  }

  table.raw().shift();
  const records = replacePlaceholdersInDataTables(table.raw(), this.var);
  records.forEach((record: string[]) => {
    const values = record
      .map((field: string) => (field ? `"${field}"` : ""))
      .join(",");
    assert.match(this.response.stdout, new RegExp(`${values}`));
  });
});

Then(
  "The app {string} should has attachments as below:",
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

      assert.ok(fs.existsSync(actualFilePath));
      assert.equal(fs.readFileSync(actualFilePath, "utf8"), record.Content);
    }
  },
);
