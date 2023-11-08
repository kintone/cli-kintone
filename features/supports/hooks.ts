/* eslint-disable new-cap */
import { AfterAll, BeforeAll, Status } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";
import os from "os";
import { Before, After } from "./world";

let rootDir: string;
let failedScenarioCount = 0;

BeforeAll(function () {
  rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `cli-kintone-e2e-test-${new Date().valueOf()}-`),
  );
  console.log(`Root working directory: ${rootDir}`);
});

Before(function () {
  this.init({ workingDir: rootDir });
});

Before({ tags: "@isolated" }, function () {
  const workingDir = fs.mkdtempSync(
    rootDir ? path.join(rootDir, "case-") : "case-",
  );
  this.init({ workingDir });
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    failedScenarioCount++;
  }
});

AfterAll(function () {
  if (failedScenarioCount === 0) {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});
