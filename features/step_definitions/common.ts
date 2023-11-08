import * as assert from "assert";
import { createCsvFile, execCliKintoneSync } from "../ultils/helper";
import { Given, When, Then } from "../ultils/world";

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
  "The app {string} with {string} has no records",
  function (appId: string, apiToken: string) {
    const command = `record delete --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --yes`;
    const response = execCliKintoneSync(command, { cwd: this.workingDir });
    if (response.status !== 0) {
      throw new Error(`Resetting app failed. Error: \n${response.stderr}`);
    }
  },
);

Given(
  "The app {string} has some records as below:",
  async function (appId, table) {
    const tempFilePath = await createCsvFile(
      table.raw(),
      this.workingDir,
      undefined,
    );
    const command = `record import --file-path ${tempFilePath} --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD`;

    const response = execCliKintoneSync(command, { cwd: this.workingDir });
    if (response.status !== 0) {
      throw new Error(`Importing CSV failed. Error: \n${response.stderr}`);
    }
  },
);

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(args, {
    env: this.env,
    cwd: this.workingDir,
  });
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
