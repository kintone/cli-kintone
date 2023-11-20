import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    await this.createCsvFile(table.raw(), filePath);
  },
);

Given(
  "There is a file {string} with content: {string}",
  async function (filePath: string, content: string) {
    await this.createFile(content, filePath);
  },
);

Then("The app {string} should has records as below:", function (appKey, table) {
  const credential = this.getCredentialByAppKey(appKey);
  const fields = table.raw()[0].join(",");
  const command = `record export --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --fields ${fields}`;
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
    const credential = this.getCredentialByAppKey(appKey);
    const command = `record export --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --attachments-dir ${this.workingDir}/${attachmentDir}`;
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
      const actualFilePath = `${this.workingDir}/${attachmentDir}/Attachment-${
        recordNumbers[record.RecordIndex as unknown as number]
      }/${record.File}`;
      assert.ok(fs.existsSync(actualFilePath));
      assert.equal(fs.readFileSync(actualFilePath, "utf8"), record.Content);
    }
  },
);
