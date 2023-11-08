/* eslint-disable new-cap */
import { OurWorld } from "../ultils/world";
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setWorldConstructor,
  Status,
} from "@cucumber/cucumber";
import fs from "fs";
import path from "path";
import os from "os";

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var workingDir: string;
}

setWorldConstructor(OurWorld);

let rootDir: string;
let failedScenarioCount = 0;

BeforeAll(function () {
  rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `cli-kintone-e2e-test-${new Date().valueOf()}-`),
  );
});

Before(function () {
  this.init({ rootDir });
});

Before({ tags: "@isolated" }, function () {
  this.initForIsolatedScenario();
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
