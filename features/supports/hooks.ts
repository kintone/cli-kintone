// Import polyfill for undici with Node.js 18
import "./undici-polyfill";

import { AfterAll, BeforeAll, Status } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";
import os from "os";
import { After, Before } from "../utils/world";
import type { Credentials } from "../utils/credentials";
import { loadCredentials } from "../utils/credentials";

let rootDir: string;
let failedScenarioCount = 0;
let credentials: Credentials;

BeforeAll(async function () {
  rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `cli-kintone-e2e-test-${new Date().valueOf()}-`),
  );
  console.log(`Root working directory: ${rootDir}`);

  credentials = await loadCredentials();
});

Before(function () {
  this.init({ workingDir: rootDir, credentials });
});

Before({ tags: "@isolated" }, function () {
  this.workingDir = fs.mkdtempSync(
    rootDir ? path.join(rootDir, "case-") : "case-",
  );
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
