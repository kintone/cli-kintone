import * as assert from "assert";
import { createCsvFile, execCliKintoneSync } from "../ultils/helper";
import { Given, Then } from "../supports/world";

Given(
  "The csv file {string} with content as below:",
  async function (filePath: string, table) {
    await createCsvFile(table.raw(), {
      baseDir: this.workingDir,
      destFilePath: filePath,
    });
  },
);

Then("The app {string} should has records as below:", function (appId, table) {
  const fields = table.raw()[0].join(",");
  const command = `record export --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --fields ${fields}`;
  const response = execCliKintoneSync(command, { cwd: this.workingDir });
  if (response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${response.stderr}`);
  }

  table.raw().shift();
  const records = table.raw();
  records.forEach((record: string[]) => {
    const values = record.map((field: string) => `"${field}"`).join(",");
    assert.match(response.stdout, new RegExp(`${values}`));
  });
});
