import * as assert from "assert";
import { Given, When, Then } from "../utils/world";
import type { Permission } from "../utils/credentials";
import { TOKEN_PERMISSIONS } from "../utils/credentials";

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
  "Load app ID of the app {string} as env var: {string}",
  function (appKey: string, destEnvVar: string) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    this.env = { [destEnvVar]: appCredential.appId, ...this.env };
  },
);

Given(
  "Load guest space ID of the app {string} as env var: {string}",
  function (appKey: string, destEnvVar: string) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    if (
      !appCredential.guestSpaceId ||
      appCredential.guestSpaceId.length === 0
    ) {
      throw new Error(`The app ${appKey} has no guest space ID`);
    }

    this.env = { [destEnvVar]: appCredential.guestSpaceId, ...this.env };
  },
);

Given(
  "Load the record numbers of the app {string} as variable: {string}",
  function (appKey: string, destVar: string) {
    const recordNumbers = this.getRecordNumbersByAppKey(appKey);
    this.replacements = { [destVar]: recordNumbers, ...this.replacements };
  },
);

Given(
  "Load app token of the app {string} with exact permissions {string} as env var: {string}",
  function (appKey: string, permission: string, destEnvVar: string) {
    const permissions = permission
      .split(",")
      .map((p) => p.trim().toLowerCase());

    if (permissions.some((p) => !TOKEN_PERMISSIONS.includes(p as Permission))) {
      throw new Error(
        `Invalid permissions found. Supported permissions: ${TOKEN_PERMISSIONS.join(
          ", ",
        )}`,
      );
    }

    const apiToken = this.getAPITokenByAppAndPermissions(
      appKey,
      permissions as Permission[],
    );
    this.env = { [destEnvVar]: apiToken, ...this.env };
  },
);

Given(
  "Load username and password of the app {string} with exact permissions {string} as env vars: {string} and {string}",
  function (
    appKey: string,
    permission: string,
    usernameEnvVar: string,
    passwordEnvVar: string,
  ) {
    const permissions = permission
      .split(",")
      .map((p) => p.trim().toLowerCase());

    if (permissions.some((p) => !TOKEN_PERMISSIONS.includes(p as Permission))) {
      throw new Error(
        `Invalid permissions found. Supported permissions: ${TOKEN_PERMISSIONS.join(
          ", ",
        )}`,
      );
    }

    const userCredential = this.getUserCredentialByAppAndUserPermissions(
      appKey,
      permissions as Permission[],
    );
    this.env = {
      [usernameEnvVar]: userCredential.username,
      [passwordEnvVar]: userCredential.password,
      ...this.env,
    };
  },
);

Given(
  "Load username and password of user {string} as env vars: {string} and {string}",
  function (userKey: string, usernameEnvVar: string, passwordEnvVar: string) {
    const userCredential = this.getUserCredentialByUserKey(userKey);
    this.env = {
      [usernameEnvVar]: userCredential.username,
      [passwordEnvVar]: userCredential.password,
      ...this.env,
    };
  },
);

Given("The app {string} has no records", function (appKey) {
  const appCredential = this.getAppCredentialByAppKey(appKey);
  const apiToken = this.getAPITokenByAppAndPermissions(appKey, [
    "view",
    "delete",
  ]);
  let command = `record delete --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --yes`;
  if (appCredential.guestSpaceId && appCredential.guestSpaceId.length > 0) {
    command += ` --guest-space-id ${appCredential.guestSpaceId}`;
  }
  this.execCliKintoneSync(command);
  if (this.response.status !== 0) {
    throw new Error(`Resetting app failed. Error: \n${this.response.stderr}`);
  }
});

Given(
  "The app {string} has some records as below:",
  async function (appKey, table) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["add"]);
    const csvObject = this.replacePlaceholdersInRawDataTables(table.raw());
    const tempFilePath = await this.generateCsvFile(csvObject);
    let command = `record import --file-path ${tempFilePath} --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken}`;
    if (appCredential.guestSpaceId && appCredential.guestSpaceId.length > 0) {
      command += ` --guest-space-id ${appCredential.guestSpaceId}`;
    }
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(`Importing CSV failed. Error: \n${this.response.stderr}`);
    }
  },
);

Given(
  "The app {string} has some records with attachments in directory {string} as below:",
  async function (appKey: string, attachmentDir: string, table) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["add"]);
    const csvObject = this.replacePlaceholdersInRawDataTables(table.raw());
    const tempFilePath = await this.generateCsvFile(csvObject);
    const command = `record import --file-path ${tempFilePath} --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --attachments-dir ${attachmentDir} --api-token ${apiToken}`;
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
  assert.notEqual(this.response.status, 0, this.response.stderr);
});

Then("I should get the exit code is zero", function () {
  assert.equal(this.response.status, 0, this.response.stderr);
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
  "The output message should match with the data below:",
  async function (table) {
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => (field ? `"${field}"` : ""))
        .join(",");
      assert.match(this.response.stdout, new RegExp(`${values}`));
    });
  },
);

Then(
  "The header row of the output message should match with the pattern: {string}",
  function (headerRow: string) {
    const reg = new RegExp(`^${headerRow}`);
    assert.match(this.response.stdout, reg);
  },
);

Then(
  "The app {string} should have {int} records",
  function (appKey, numberOfRecords: number) {
    const recordNumbers = this.getRecordNumbersByAppKey(appKey);
    assert.equal(recordNumbers.length, numberOfRecords);
  },
);

Then(
  "The app {string} should have headers as below:",
  function (appKey, table) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    let command = `record export --app ${appCredential.appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken}`;
    if (appCredential.guestSpaceId && appCredential.guestSpaceId.length > 0) {
      command += ` --guest-space-id ${appCredential.guestSpaceId}`;
    }
    this.execCliKintoneSync(command);
    if (this.response.status !== 0) {
      throw new Error(
        `Getting records failed. Error: \n${this.response.stderr}`,
      );
    }

    const records = table.raw();
    const values = (records[0] ?? [])
      .map((field: string) => {
        if (!field) {
          return "";
        }

        if (field === "*") {
          return `\\${field}`;
        }

        return `"${field}"`;
      })
      .join(",");
    assert.match(this.response.stdout, new RegExp(`${values}`));
  },
);
