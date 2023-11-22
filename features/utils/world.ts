import type { SpawnSyncReturns } from "child_process";
import type { Credentials, AppCredential, Permission } from "./credentials";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import {
  generateCsvFile,
  execCliKintoneSync,
  generateFile,
  getRecordNumbers,
} from "./helper";
import {
  getAppCredentialByAppKey,
  getAPITokenByAppAndPermissions,
  getUserCredentialByUserKey,
  getUserCredentialByAppAndUserPermissions,
} from "./credentials";

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  private _workingDir?: string;
  private _credentials?: Credentials;
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

  public get credentials() {
    if (this._credentials === undefined) {
      throw new Error("No credentials found. Please init credentials first.");
    }
    return this._credentials;
  }

  public get workingDir() {
    if (this._workingDir === undefined) {
      throw new Error("No working dir found. Please init working dir first.");
    }
    return this._workingDir;
  }

  public set workingDir(value: string) {
    this._workingDir = value;
  }

  public init(options: { workingDir?: string; credentials?: Credentials }) {
    if (options.workingDir && options.workingDir.length > 0) {
      this.workingDir = options.workingDir;
    }

    if (options.credentials) {
      this._credentials = options.credentials;
    }
  }

  public execCliKintoneSync(args: string) {
    this.response = execCliKintoneSync(args, {
      env: this.env,
      cwd: this.workingDir,
    });
  }

  public async generateCsvFile(inputCsvObject: string[][], filePath?: string) {
    return generateCsvFile(inputCsvObject, {
      baseDir: this.workingDir,
      destFilePath: filePath,
    });
  }

  public async generateFile(content: string, filePath: string) {
    return generateFile(content, filePath, { baseDir: this.workingDir });
  }

  public getAppCredentialByAppKey(appKey: string): AppCredential {
    const appCredential = getAppCredentialByAppKey(
      this.credentials.apps,
      appKey,
    );
    if (appCredential === undefined) {
      throw new Error(`The credential with app key ${appKey} is not found`);
    }

    if (appCredential.appId.length === 0) {
      throw new Error(`The credential with app key ${appKey} has no App ID`);
    }

    return appCredential;
  }

  public getAPITokenByAppAndPermissions(
    appKey: string,
    permissions: Permission[],
  ): string {
    const apiToken = getAPITokenByAppAndPermissions(
      this.credentials.apps,
      appKey,
      permissions,
    );

    if (!apiToken) {
      throw new Error(
        `The token with exact permissions (${permissions.join(
          ", ",
        )}) is not found.`,
      );
    }

    return apiToken.token;
  }

  public getUserCredentialByUserKey(userKey: string) {
    const userCredential = getUserCredentialByUserKey(
      this.credentials.users,
      userKey,
    );
    if (userCredential === undefined) {
      throw new Error(
        `The user credential with user key ${userKey} is not found`,
      );
    }

    return userCredential;
  }

  public getUserCredentialByAppAndUserPermissions(
    appKey: string,
    permissions: Permission[],
  ) {
    const userCredential = getUserCredentialByAppAndUserPermissions(
      this.credentials,
      appKey,
      permissions,
    );
    if (userCredential === undefined) {
      throw new Error(
        `The user credential with app key ${appKey} and exact permissions (${permissions.join(
          ", ",
        )}) is not found`,
      );
    }

    return userCredential;
  }

  public getRecordNumbersByAppKey(appKey: string): string[] {
    const credential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    return getRecordNumbers(credential.appId, apiToken);
  }
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
export const Before = cucumber.Before<OurWorld>;
export const After = cucumber.After<OurWorld>;
