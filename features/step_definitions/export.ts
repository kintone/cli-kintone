import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import {
  compareBuffers,
  generateCsvRow,
  validateRequireColumnsInTable,
} from "../utils/helper";

Given("I have a directory {string}", function (directory: string) {
  fs.mkdirSync(path.join(this.workingDir, directory));
});

Then(
  "The directory {string} should contain files as below:",
  function (attachmentDir, table) {
    validateRequireColumnsInTable(table.raw()[0], ["FilePath", "FileName"]);

    const records = this.replacePlaceholdersInHashesDataTables(table.hashes());
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const actualFilePath = `${this.workingDir}/${attachmentDir}/${record.FilePath}/${record.FileName}`;

      assert.ok(
        fs.existsSync(actualFilePath),
        `The file "${actualFilePath}" is not found`,
      );
    }
  },
);

Then(
  "The directory {string} should contain files with filename and content as below:",
  function (attachmentDir, table) {
    validateRequireColumnsInTable(table.raw()[0], [
      "FilePath",
      "FileName",
      "Content",
    ]);

    const records = this.replacePlaceholdersInHashesDataTables(table.hashes());
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const actualFilePath = `${this.workingDir}/${attachmentDir}/${record.FilePath}/${record.FileName}`;

      assert.ok(
        fs.existsSync(actualFilePath),
        `The file "${actualFilePath}" is not found`,
      );

      const actualContent = fs.readFileSync(actualFilePath, "utf8");
      assert.equal(
        actualContent,
        record.Content,
        `The content of the file "${actualFilePath}" does not matched.`,
      );
    }
  },
);

Then("The exported files should match as below:", function (table) {
  validateRequireColumnsInTable(table.raw()[0], [
    "Expected_FilePath",
    "Actual_FilePath",
  ]);

  const records = this.replacePlaceholdersInHashesDataTables(table.hashes());
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    const actualFilePath = path.join(this.workingDir, record.Actual_FilePath);
    const expectedFilePath = path.join(
      this.workingDir,
      record.Expected_FilePath,
    );

    assert.ok(
      fs.existsSync(actualFilePath),
      `The file "${actualFilePath}" is not found.`,
    );

    assert.ok(
      compareBuffers(
        fs.readFileSync(actualFilePath),
        fs.readFileSync(expectedFilePath),
      ),
      `The content of the file "${record.Actual_FilePath}" does not matched.\n` +
        `Expected file path: ${expectedFilePath}\n` +
        `Actual file path: ${actualFilePath}`,
    );
  }
});

Then(
  "The output message should match the data in the order as below:",
  async function (table) {
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    let matchStr = "";
    records.forEach((record: string[]) => {
      const csvRow = generateCsvRow(record);
      matchStr += `${csvRow}(.*)\n`;
    });
    const reg = new RegExp(matchStr);
    assert.match(
      this.response.stdout.toString(),
      reg,
      `The output message does not match the data in the order.\nExpected: \n${JSON.stringify(
        records,
      )}\nActual: \n${this.response.stdout}`,
    );
  },
);

Then(
  "The output message with table field should match the data below:",
  async function (table) {
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.forEach((record: string[]) => {
      const csvRow = generateCsvRow(record);
      assert.match(this.response.stdout.toString(), new RegExp(`${csvRow}`));
    });
  },
);

Then(
  "The output message with {string} encoded should match with the data below:",
  async function (encoding, table) {
    const decodedOutputMsg = iconv.decode(this.response.stdout, encoding);
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.forEach((record: string[]) => {
      const csvRow = generateCsvRow(record);
      assert.match(decodedOutputMsg, new RegExp(`${csvRow}`));
    });
  },
);
