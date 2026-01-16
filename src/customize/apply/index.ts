import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { logger } from "../../utils/log";
import { retry } from "../../utils/retry";
import {
  buildRestAPIClient,
  type RestAPIClientOptions,
} from "../../kintone/client";
import { getBoundMessage, isUrlString } from "../core";
import type { BoundMessage, CustomizeManifest } from "../core";

export type ApplyParams = RestAPIClientOptions & {
  appId: string;
  inputPath: string;
  yes: boolean;
};

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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apply = async (
  apiClient: KintoneRestAPIClient,
  appId: string,
  manifest: CustomizeManifest,
  manifestDir: string,
  boundMessage: BoundMessage,
) => {
  logger.debug(`Starting apply for app ${appId}`);
  logger.debug(`Manifest scope: ${manifest.scope}`);
  logger.debug(`Manifest directory: ${manifestDir}`);

  // State to track progress across retries
  let uploadedManifest: ReturnType<typeof createUpdatedManifest> | null = null;
  let updated = false;

  await retry(
    async () => {
      // Step 1: Upload files (skip if already done)
      if (!uploadedManifest) {
        logger.debug("Uploading customization files...");
        logger.info(boundMessage("M_StartUploading"));
        try {
          const uploadFilesResult = await getUploadFilesResult(
            apiClient,
            manifest,
            manifestDir,
            boundMessage,
          );

          // eslint-disable-next-line require-atomic-updates
          uploadedManifest = createUpdatedManifest(
            appId,
            manifest,
            uploadFilesResult,
          );
          logger.debug("All files uploaded successfully");
          logger.info(boundMessage("M_FileUploaded"));
        } catch (error) {
          logger.error(boundMessage("E_FileUploaded"));
          throw error;
        }
      }

      // Step 2: Update customization settings (skip if already done)
      if (!updated) {
        try {
          logger.debug("Updating customization settings...");
          await apiClient.app.updateAppCustomize(uploadedManifest);
          logger.debug("Customization settings updated");
          logger.info(boundMessage("M_Updated"));
          // eslint-disable-next-line require-atomic-updates
          updated = true;
        } catch (error) {
          logger.error(boundMessage("E_Updated"));
          throw error;
        }
      }

      // Step 3: Deploy
      try {
        logger.debug("Starting deployment...");
        await apiClient.app.deployApp({ apps: [{ app: appId }] });
        await waitForDeploy(apiClient, appId, () =>
          logger.info(boundMessage("M_Deploying")),
        );
        logger.debug("Deployment completed");
        logger.info(boundMessage("M_Deployed"));
      } catch (error) {
        logger.error(boundMessage("E_Deployed"));
        throw error;
      }
    },
    {
      onError: (e, attemptCount, toRetry, nextDelay, config) => {
        logger.debug(`Error occurred: ${e}`);
        if (toRetry) {
          logger.debug(
            `Retry attempt ${attemptCount}/${config.maxAttempt}, next delay: ${nextDelay}ms`,
          );
          logger.warn(boundMessage("E_Retry"));
        }
      },
    },
  );
};

const waitForDeploy = async (
  apiClient: KintoneRestAPIClient,
  appId: string,
  callback: () => void,
) => {
  let deployed = false;
  let checkCount = 0;
  logger.debug(`Waiting for deployment to finish for app ${appId}`);
  while (!deployed) {
    checkCount++;
    const resp = await apiClient.app.getDeployStatus({ apps: [appId] });
    const successedApps = resp.apps.filter((r) => r.status === "SUCCESS");
    deployed = successedApps.length === resp.apps.length;
    const currentStatus = resp.apps[0]?.status || "UNKNOWN";
    logger.debug(`Deploy status check #${checkCount}: ${currentStatus}`);
    if (!deployed) {
      await wait(1000);
      callback();
    }
  }
  logger.debug(`Deployment finished after ${checkCount} checks`);
};

const getJsCssFiles = (manifest: JsCssManifest) => {
  return [
    manifest.desktop.js,
    manifest.desktop.css,
    manifest.mobile.js,
    manifest.mobile.css,
  ];
};

const resolveFilePath = (file: string, manifestDir: string): string => {
  if (isUrlString(file)) {
    return file;
  }
  return path.resolve(manifestDir, file);
};

const prepareCustomizeFile = async (
  apiClient: KintoneRestAPIClient,
  fileOrUrl: string,
): Promise<
  { type: "URL"; url: string } | { type: "FILE"; file: { fileKey: string } }
> => {
  logger.debug(`Preparing customize file: ${fileOrUrl}`);
  if (isUrlString(fileOrUrl)) {
    logger.debug(`File is URL, skipping upload`);
    return { type: "URL", url: fileOrUrl };
  }
  logger.debug(`Uploading file: ${fileOrUrl}`);
  const { fileKey } = await apiClient.file.uploadFile({
    file: { path: fileOrUrl },
  });
  logger.debug(`File uploaded, fileKey: ${fileKey}`);
  return { type: "FILE", file: { fileKey } };
};

const getUploadFilesResult = async (
  apiClient: KintoneRestAPIClient,
  manifest: CustomizeManifest,
  manifestDir: string,
  boundMessage: BoundMessage,
) => {
  const uploadFilesResult = [];
  const allFiles = getJsCssFiles(manifest);
  const totalFiles = allFiles.reduce((sum, files) => sum + files.length, 0);
  logger.debug(`Processing ${totalFiles} files for upload`);

  for (const files of allFiles) {
    const results = [];
    for (const file of files) {
      const resolvedPath = resolveFilePath(file, manifestDir);
      logger.debug(`Processing file: ${file} -> ${resolvedPath}`);
      const result = await prepareCustomizeFile(apiClient, resolvedPath);
      if (result.type === "FILE") {
        logger.debug(`File uploaded: ${resolvedPath}`);
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
  uploadFilesResult: Array<
    Array<Awaited<ReturnType<typeof prepareCustomizeFile>>>
  >,
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

export const runApply = async (params: ApplyParams) => {
  const { appId, inputPath, yes, ...restApiClientOptions } = params;
  const boundMessage = getBoundMessage("en");

  logger.debug(`Starting apply for app ${appId}`);
  logger.debug(`Input path: ${inputPath}`);

  const manifestDir = path.dirname(path.resolve(inputPath));
  logger.debug(`Manifest directory: ${manifestDir}`);

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

  const apiClient = buildRestAPIClient(restApiClientOptions);

  await apply(apiClient, appId, manifest, manifestDir, boundMessage);
};
