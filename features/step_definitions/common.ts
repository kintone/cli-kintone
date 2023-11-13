import * as assert from "assert";
import { Given, When, Then } from "../ultils/world";
import type { Permission } from "../ultils/types";

Given(
  "Load environment variable {string} as {string}",
  function (srcKey: string, destKey: string) {
    const value = process.env[srcKey];
    if (value === undefined) {
      throw new Error(`The env variable is missing: ${srcKey}`);
    }
    this.env = { [destKey]: value, ...this.env };
  },
);

Given(
  "Load app ID of app {string} as env var: {string}",
  function (appKey: string, destEnvVar: string) {
    const credential = this.getCredentialByAppKey(appKey);
    this.env = { [destEnvVar]: credential.appId, ...this.env };
  },
);

Given(
  "Load app token of app {string} with exact permissions {string} as env var: {string}",
  function (appKey: string, permission: string, destEnvVar: string) {
    const permissions = permission
      .split(",")
      .map((p) => p.trim().toLowerCase()) as Permission[];
    const apiToken = this.getAPITokenByAppAndPermission(appKey, permissions);
    this.env = { [destEnvVar]: apiToken, ...this.env };
  },
);

Given("The app {string} has no records", function (appKey) {
  const credential = this.getCredentialByAppKey(appKey);
  const apiToken = this.getAPITokenByAppAndPermission(appKey, [
    "view",
    "delete",
  ]);
  const command = `record delete --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --yes`;
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Resetting app failed. Error: \n${this.response.stderr}`);
  }
});

Given(
  "The app {string} has some records as below:",
  async function (appKey, table) {
    const credential = this.getCredentialByAppKey(appKey);
    const tempFilePath = await this.createCsvFile(table.raw());
    const command = `record import --file-path ${tempFilePath} --app ${credential.appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD`;
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(`Importing CSV failed. Error: \n${this.response.stderr}`);
    }
  },
);

When("I run the command with args {string}", function (args: string) {
  this.execCliKintoneSync(args);
});

Then("I should get the exit code is non-zero", function () {
  assert.notEqual(this.response.status, 0);
});

Then("I should get the exit code is zero", function () {
  assert.equal(this.response.status, 0);
});

Then(
  "The output error message should match with the pattern: {string}",
  function (errorMessage: string) {
    const reg = new RegExp(errorMessage);
    assert.match(this.response.stderr, reg);
  },
);

Then(
  "The output message should match with the pattern: {string}",
  function (message: string) {
    const reg = new RegExp(message);
    assert.match(this.response.stdout, reg);
  },
);

Then(
  "The header row of the output message should match with the pattern: {string}",
  function (headerRow: string) {
    const reg = new RegExp(`^${headerRow}`);
    assert.match(this.response.stdout, reg);
  },
);
