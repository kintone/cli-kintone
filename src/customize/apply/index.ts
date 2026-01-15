import fs from "fs";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
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

  logger.debug(`Starting apply for app ${appId}`);
  logger.debug(`Manifest scope: ${manifest.scope}`);

  try {
    if (!updateBody) {
      logger.debug("Uploading customization files...");
      logger.info(boundMessage("M_StartUploading"));
      try {
        const uploadFilesResult = await getUploadFilesResult(
          kintoneApiClient,
          manifest,
          boundMessage,
        );

        updateBody = createUpdatedManifest(appId, manifest, uploadFilesResult);
        logger.debug("All files uploaded successfully");
        logger.info(boundMessage("M_FileUploaded"));
      } catch (error) {
        logger.error(boundMessage("E_FileUploaded"));
        throw error;
      }
    }

    if (!updated) {
      try {
        logger.debug("Updating customization settings...");
        await kintoneApiClient.updateCustomizeSetting(updateBody);
        logger.debug("Customization settings updated");
        logger.info(boundMessage("M_Updated"));
        updated = true;
      } catch (error) {
        logger.error(boundMessage("E_Updated"));
        throw error;
      }
    }

    try {
      logger.debug("Starting deployment...");
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        logger.info(boundMessage("M_Deploying")),
      );
      logger.debug("Deployment completed");
      logger.info(boundMessage("M_Deployed"));
    } catch (error) {
      logger.error(boundMessage("E_Deployed"));
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
  const allFiles = getJsCssFiles(manifest);
  const totalFiles = allFiles.reduce((sum, files) => sum + files.length, 0);
  logger.debug(`Processing ${totalFiles} files for upload`);

  for (const files of allFiles) {
    const results = [];
    for (const file of files) {
      logger.debug(`Processing file: ${file}`);
      const result = await kintoneApiClient.prepareCustomizeFile(file);
      if (result.type === "FILE") {
        logger.debug(`File uploaded: ${file}`);
        logger.info(`${file} ` + boundMessage("M_Uploaded"));
      } else {
        logger.debug(`File is URL, skipping upload: ${file}`);
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
  logger.debug(`Error occurred: ${error}`);
  if (isAuthenticationError) {
    logger.debug("Authentication error detected, not retrying");
    throw new Error(boundMessage("E_Authentication"));
  } else if (retryCount < MAX_RETRY_COUNT) {
    logger.debug(`Retry attempt ${retryCount}/${MAX_RETRY_COUNT}`);
    await wait(1000);
    logger.warn(boundMessage("E_Retry"));
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

  logger.debug(`Starting apply for app ${appId}`);
  logger.debug(`Input path: ${inputPath}`);

  const manifest: CustomizeManifest = JSON.parse(
    fs.readFileSync(inputPath, "utf8"),
  );
  logger.debug(`Manifest loaded: scope=${manifest.scope}`);

  // support an old format for customize-manifest.json that doesn't have mobile.css
  manifest.mobile.css = manifest.mobile.css || [];

  // Confirmation prompt before applying
  if (!yes) {
    logger.debug("Prompting for confirmation...");
    const shouldApply = await confirm({
      message: `Apply customization to app ${appId}?`,
      default: false,
    });
    if (!shouldApply) {
      logger.info("Operation cancelled.");
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
  logger.info(boundMessage("M_Deployed"));
};
