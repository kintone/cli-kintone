import * as assert from "assert";
import { Then } from "../supports/world";

const NO_RECORDS_WARNING =
  "No records exist in the app or match the condition.";

Then("The app {string} has no records", function (appId) {
  const command = `record export --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD`;
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${this.response.stderr}`);
  }

  const actualData = this.response.stdout.slice(
    this.response.stdout.indexOf("\n") + 1,
  );

  assert.equal(actualData, "");
  assert.match(this.response.stderr, new RegExp(NO_RECORDS_WARNING));
});
