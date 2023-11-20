import type { SpawnSyncReturns } from "child_process";
import type { Credential, Permission } from "./credentials";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import { createCsvFile, execCliKintoneSync, createFile } from "./helper";
import {
  getCredentialByAppKey,
  getAPITokenByAppAndPermissions,
} from "./credentials";

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  private _workingDir?: string;
  private _credentials?: Credential[];
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
      throw new Error("No credentials found. Please load credentials first.");
    }
    return this._credentials;
  }

  public set credentials(value: Credential[]) {
    this._credentials = value;
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

  public execCliKintoneSync(args: string) {
    this.response = execCliKintoneSync(args, {
      env: this.env,
      cwd: this.workingDir,
    });
  }

  public async createCsvFile(inputCsvObject: string[][], filePath?: string) {
    return createCsvFile(inputCsvObject, {
      baseDir: this.workingDir,
      destFilePath: filePath,
    });
  }

  public async createFile(content: string, filePath: string) {
    return createFile(content, filePath, { baseDir: this.workingDir });
  }

  public getCredentialByAppKey(appKey: string): Credential {
    const credential = getCredentialByAppKey(this.credentials, appKey);
    if (credential === undefined) {
      throw new Error(`The credential with app key ${appKey} is not found`);
    }

    if (credential.appId.length === 0) {
      throw new Error(`The credential with app key ${appKey} has no App ID`);
    }

    return credential;
  }

  public getAPITokenByAppAndPermissions(
    appKey: string,
    permissions: Permission[],
  ): string {
    const apiToken = getAPITokenByAppAndPermissions(
      this.credentials,
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
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
export const Before = cucumber.Before<OurWorld>;
export const After = cucumber.After<OurWorld>;
