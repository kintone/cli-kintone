import * as assert from "assert";
import { Given, Then } from "../utils/world";

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
    const values = record.map((field: string) => `"${field}"`).join(",");
    assert.match(this.response.stdout, new RegExp(`${values}`));
  });
});

Then(
  "The app {string} should has attachments as below:",
  function (appKey, table) {
    const credential = this.getCredentialByAppKey(appKey);
    const command = `record export --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --attachments-dir ${this.workingDir}`;
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(
        `Getting records failed. Error: \n${this.response.stderr}`,
      );
    }

    // name
    // content
  },
);
