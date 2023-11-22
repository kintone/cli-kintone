import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    await this.generateCsvFile(table.raw(), filePath);
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
  const command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --fields ${fields}`;
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${this.response.stderr}`);
  }

  table.raw().shift();
  const records = table.raw();
  records.forEach((record: string[]) => {
    const values = record
      .map((field: string) => (field ? `"${field}"` : ""))
      .join(",");
    assert.match(this.response.stdout, new RegExp(`${values}`));
  });
});

Then(
  "The app {string} should has attachments in {string} as below:",
  function (appKey, attachmentDir, table) {
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
      const actualFilePath = `${this.workingDir}/${attachmentDir}/Attachment-${recordNumber}/${record.File}`;

      assert.ok(fs.existsSync(actualFilePath));
      assert.equal(fs.readFileSync(actualFilePath, "utf8"), record.Content);
    }
  },
);
