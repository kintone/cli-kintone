import * as assert from "assert";
import { Given, Then } from "../ultils/world";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    await this.createCsvFile(table.raw(), filePath);
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
