import fs from "fs";
import { confirm } from "@inquirer/prompts";
import {
  KintoneApiClient,
  AuthenticationError,
  getBoundMessage,
  wait,
} from "../core";
import type { BoundMessage, CustomizeManifest, Option } from "../core";

export interface ApplyParams {
  appId: string;
  inputPath: string;
  yes: boolean;
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  basicAuthUsername: string | null;
  basicAuthPassword: string | null;
  options: Option;
}

export interface Status {
  retryCount: number;
  updateBody: any;
  updated: boolean;
}

interface JsCssManifest {
  desktop: {
    js: string[];
    css: string[];
  };
  mobile: {
    js: string[];
    css: string[];
  };
}

interface HandleApplyErrorParameter {
  error: any;
  appId: string;
  manifest: CustomizeManifest;
  updateBody: any;
  updated: boolean;
  retryCount: number;
  options: Option;
  kintoneApiClient: KintoneApiClient;
  boundMessage: BoundMessage;
}

const MAX_RETRY_COUNT = 3;

export const apply = async (
  kintoneApiClient: KintoneApiClient,
  appId: string,
  manifest: CustomizeManifest,
  status: Status,
  options: Option,
  boundMessage: BoundMessage,
): Promise<void> => {
  let { retryCount, updateBody, updated } = status;

  try {
    if (!updateBody) {
      console.log(boundMessage("M_StartUploading"));
      try {
        const uploadFilesResult = await getUploadFilesResult(
          kintoneApiClient,
          manifest,
          boundMessage,
        );

        updateBody = createUpdatedManifest(appId, manifest, uploadFilesResult);
        console.log(boundMessage("M_FileUploaded"));
      } catch (error) {
        console.log(boundMessage("E_FileUploaded"));
        throw error;
      }
    }

    if (!updated) {
      try {
        await kintoneApiClient.updateCustomizeSetting(updateBody);
        console.log(boundMessage("M_Updated"));
        updated = true;
      } catch (error) {
        console.log(boundMessage("E_Updated"));
        throw error;
      }
    }

    try {
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        console.log(boundMessage("M_Deploying")),
      );
      console.log(boundMessage("M_Deployed"));
    } catch (error) {
      console.log(boundMessage("E_Deployed"));
      throw error;
    }
  } catch (error) {
    const params: HandleApplyErrorParameter = {
      error,
      appId,
      manifest,
      updateBody,
      updated,
      retryCount,
      options,
      kintoneApiClient,
      boundMessage,
    };
    await handleApplyError(params);
  }
};

const getJsCssFiles = (manifest: JsCssManifest) => {
  return [
    manifest.desktop.js,
    manifest.desktop.css,
    manifest.mobile.js,
    manifest.mobile.css,
  ];
};

const getUploadFilesResult = async (
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeManifest,
  boundMessage: BoundMessage,
) => {
  const uploadFilesResult = [];
  for (const files of getJsCssFiles(manifest)) {
    const results = [];
    for (const file of files) {
      const result = await kintoneApiClient.prepareCustomizeFile(file);
      if (result.type === "FILE") {
        console.log(`${file} ` + boundMessage("M_Uploaded"));
      }
      results.push(result);
    }
    uploadFilesResult.push(results);
  }

  return uploadFilesResult;
};

const createUpdatedManifest = (
  appId: string,
  manifest: CustomizeManifest,
  uploadFilesResult: any,
) => {
  return {
    app: appId,
    scope: manifest.scope,
    desktop: {
      js: uploadFilesResult[0],
      css: uploadFilesResult[1],
    },
    mobile: {
      js: uploadFilesResult[2],
      css: uploadFilesResult[3],
    },
  };
};

const handleApplyError = async (params: HandleApplyErrorParameter) => {
  const {
    error,
    appId,
    manifest,
    updateBody,
    updated,
    options,
    kintoneApiClient,
    boundMessage,
  } = params;
  let { retryCount } = params;
  const isAuthenticationError = error instanceof AuthenticationError;
  retryCount++;
  if (isAuthenticationError) {
    throw new Error(boundMessage("E_Authentication"));
  } else if (retryCount < MAX_RETRY_COUNT) {
    await wait(1000);
    console.log(boundMessage("E_Retry"));
    await apply(
      kintoneApiClient,
      appId,
      manifest,
      { retryCount, updateBody, updated },
      options,
      boundMessage,
    );
  } else {
    throw error;
  }
};

export const runApply = async (params: ApplyParams): Promise<void> => {
  const {
    appId,
    inputPath,
    yes,
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    baseUrl,
    options,
  } = params;
  const boundMessage = getBoundMessage("en");

  const manifest: CustomizeManifest = JSON.parse(
    fs.readFileSync(inputPath, "utf8"),
  );

  // support an old format for customize-manifest.json that doesn't have mobile.css
  manifest.mobile.css = manifest.mobile.css || [];

  // Confirmation prompt before applying
  if (!yes) {
    const shouldApply = await confirm({
      message: `Apply customization to app ${appId}?`,
      default: false,
    });
    if (!shouldApply) {
      console.log("Operation cancelled.");
      return;
    }
  }

  const status: Status = {
    retryCount: 0,
    updateBody: null,
    updated: false,
  };

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    baseUrl,
    options,
  );

  await apply(kintoneApiClient, appId, manifest, status, options, boundMessage);
  console.log(boundMessage("M_Deployed"));
};
