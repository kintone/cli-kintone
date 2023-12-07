import * as assert from "assert";
import { Then } from "../utils/world";

const NO_RECORDS_WARNING =
  "No records exist in the app or match the condition.";

Then("The app {string} should have no records", function (appKey) {
  const appCredential = this.getAppCredentialByAppKey(appKey);
  const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
  const command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken}`;
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${this.response.stderr}`);
  }

  const actualData = this.response.stdout
    .toString()
    .slice(this.response.stdout.toString().indexOf("\n") + 1);

  assert.equal(actualData, "");
  assert.match(this.response.stderr.toString(), new RegExp(NO_RECORDS_WARNING));
});
