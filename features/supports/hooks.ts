import { AfterAll, BeforeAll, Status } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";
import os from "os";
import { Before, After } from "../utils/world";
import { loadCredentials } from "../utils/credentials";
import type { Credential } from "../utils/credentials";

let rootDir: string;
const failedScenarioCount = 0;
let credentials: Credential[];

BeforeAll(async function () {
  rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `cli-kintone-e2e-test-${new Date().valueOf()}-`),
  );
  console.log(`Root working directory: ${rootDir}`);

  credentials = await loadCredentials();
});

Before(function () {
  this.workingDir = rootDir;
  this.credentials = credentials;
});

Before({ tags: "@isolated" }, function () {
  const workingDir = fs.mkdtempSync(
    rootDir ? path.join(rootDir, "case-") : "case-",
  );
  this.workingDir = workingDir;
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // failedScenarioCount++;
  }
});

AfterAll(function () {
  if (failedScenarioCount === 0) {
    // fs.rmSync(rootDir, { recursive: true, force: true });
  }
});
