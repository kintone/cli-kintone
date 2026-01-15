import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { isUrlString, parseProxy, wait } from "./util";
import { logger } from "../../utils/log";

export interface Option {
  proxy: string;
  guestSpaceId: number;
}

export type UpdateAppCustomizeParameter = {
  app: string | number;
  scope?: "ALL" | "ADMIN" | "NONE" | undefined;
  desktop?: { [key: string]: unknown };
  mobile?: { [key: string]: unknown };
  revision?: string | number;
};

export default class KintoneApiClient {
  private restApiClient: KintoneRestAPIClient;
  public options: Option;
  public constructor(
    username: string | null,
    password: string | null,
    oAuthToken: string | null,
    basicAuthUsername: string | null,
    basicAuthPassword: string | null,
    baseUrl: string,
    options: Option,
  ) {
    this.options = options;
    let auth;
    if (username && password) {
      auth = {
        username,
        password,
      };
    }
    if (oAuthToken) {
      auth = {
        oAuthToken,
      };
    }
    let basicAuth;
    if (basicAuthUsername && basicAuthPassword) {
      basicAuth = {
        username: basicAuthUsername,
        password: basicAuthPassword,
      };
    }
    let guestSpaceId;
    if (options.guestSpaceId) {
      guestSpaceId = options.guestSpaceId;
    }
    let proxy;
    if (options.proxy) {
      proxy = parseProxy(options.proxy);
    }
    logger.debug(`Initializing KintoneApiClient with baseUrl: ${baseUrl}`);
    if (guestSpaceId) {
      logger.debug(`Guest space ID: ${guestSpaceId}`);
    }
    if (proxy) {
      logger.debug(`Using proxy`);
    }
    this.restApiClient = new KintoneRestAPIClient({
      baseUrl,
      auth,
      basicAuth,
      featureFlags: {
        enableAbortSearchError: false,
      },
      guestSpaceId,
      proxy,
    });
    logger.debug("KintoneApiClient initialized");
  }

  public uploadFile(filePath: string) {
    return this.restApiClient.file.uploadFile({
      file: {
        path: filePath,
      },
    });
  }

  public async prepareCustomizeFile(fileOrUrl: string): Promise<any> {
    logger.debug(`Preparing customize file: ${fileOrUrl}`);
    const isUrl = isUrlString(fileOrUrl);
    if (isUrl) {
      logger.debug(`File is URL, skipping upload`);
      return {
        type: "URL",
        url: fileOrUrl,
      };
    }
    logger.debug(`Uploading file: ${fileOrUrl}`);
    const { fileKey } = await this.uploadFile(fileOrUrl);
    logger.debug(`File uploaded, fileKey: ${fileKey}`);
    return {
      type: "FILE",
      file: {
        fileKey,
      },
    };
  }

  public updateCustomizeSetting(params: UpdateAppCustomizeParameter) {
    return this.restApiClient.app.updateAppCustomize(params);
  }

  public deploySetting(appId: string) {
    return this.restApiClient.app.deployApp({
      apps: [{ app: appId }],
    });
  }

  public async waitFinishingDeploy(appId: string, callback: () => void) {
    let deployed = false;
    let checkCount = 0;
    logger.debug(`Waiting for deployment to finish for app ${appId}`);
    while (!deployed) {
      checkCount++;
      const resp = await this.restApiClient.app.getDeployStatus({
        apps: [appId],
      });
      const successedApps = resp.apps;
      const successedAppsLength = successedApps.filter(
        (r: { status: string; app: string }) => {
          return r.status === "SUCCESS";
        },
      ).length;
      deployed = successedAppsLength === resp.apps.length;
      const currentStatus = resp.apps[0]?.status || "UNKNOWN";
      logger.debug(`Deploy status check #${checkCount}: ${currentStatus}`);
      if (!deployed) {
        await wait(1000);
        callback();
      }
    }
    logger.debug(`Deployment finished after ${checkCount} checks`);
    deployed = true;
  }

  public downloadFile(fileKey: string) {
    logger.debug(`Downloading file with fileKey: ${fileKey}`);
    return this.restApiClient.file.downloadFile({
      fileKey,
    });
  }

  public getAppCustomize(appId: string) {
    logger.debug(`Getting app customize for app ${appId}`);
    return this.restApiClient.app.getAppCustomize({
      app: appId,
    });
  }

  private getBase64EncodedCredentials(
    username: string,
    password: string,
  ): string {
    const buffer = Buffer.from(username + ":" + password);
    return buffer.toString("base64");
  }

  private getBasicAuthorization(
    basicAuthUsername: string,
    basicAuthPassword: string,
  ): string {
    return `Basic ${this.getBase64EncodedCredentials(
      basicAuthUsername,
      basicAuthPassword,
    )}`;
  }
}

export class AuthenticationError extends Error {}
