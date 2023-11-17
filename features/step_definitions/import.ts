import * as assert from "assert";
import { Given, Then } from "../utils/world";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    await this.createCsvFile(table.raw(), filePath);
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
    const values = record.map((field: string) => `"${field}"`).join(",");
    assert.match(this.response.stdout, new RegExp(`${values}`));
  });
});
