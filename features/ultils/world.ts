import type { SpawnSyncReturns } from "child_process";
import { World } from "@cucumber/cucumber";
import * as cucumber from "@cucumber/cucumber";
import fs from "fs";
import path from "path";

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  public workingDir?: string;
  private _response?: SpawnSyncReturns<string>;

  public get response() {
    if (this._response === undefined) {
      throw new Error("No response found. Please run cli-kintone first.");
    }
    return this._response;
  }

  public set response(value) {
    this._response = value;
  }

  public init(options: { rootDir: string }) {
    this.workingDir = options.rootDir;
    this.log(`Root working directory: ${this.workingDir}`);
  }

  public initForIsolatedScenario() {
    this.workingDir = fs.mkdtempSync(
      this.workingDir ? path.join(this.workingDir, "case-") : "case-",
    );
    this.log(`Scenario working directory: ${this.workingDir}`);
  }
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
