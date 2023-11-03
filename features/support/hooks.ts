/* eslint-disable new-cap */
import { BeforeAll, After, AfterAll, Status } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";
import os from "os";

let workingDir: string;
let failedScenarioCount = 0;

BeforeAll(function () {
  workingDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-kintone-e2e-test-"));
  process.chdir(workingDir);
  console.log(`Current working directory: ${workingDir}`);
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    failedScenarioCount++;
  }
});

AfterAll(function () {
  if (failedScenarioCount === 0) {
    fs.rmSync(workingDir, { recursive: true, force: true });
  }
});
