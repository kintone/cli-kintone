import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";
import {
  KintoneRestAPIError,
  type KintoneRestAPIClient,
} from "@kintone/rest-api-client";
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
      retryCondition: (e: unknown) =>
        e instanceof KintoneRestAPIError && e.status >= 500 && e.status < 600,
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
  onProgress: () => void,
) => {
  const POLLING_INTERVAL_MS = 1000;
  const PROGRESS_NOTIFY_INTERVAL_MS = 5000;

  const startTime = Date.now();
  logger.debug(`Waiting for deployment to finish for app ${appId}`);

  const progressTimer = setInterval(onProgress, PROGRESS_NOTIFY_INTERVAL_MS);

  try {
    while (true) {
      const resp = await apiClient.app.getDeployStatus({ apps: [appId] });
      const successedApps = resp.apps.filter((r) => r.status === "SUCCESS");
      const deployed = successedApps.length === resp.apps.length;
      const currentStatus = resp.apps[0]?.status || "UNKNOWN";
      logger.debug(
        `Deploy status check at ${Date.now() - startTime}ms: ${currentStatus}`,
      );
      if (deployed) {
        break;
      }
      await wait(POLLING_INTERVAL_MS);
    }
  } finally {
    clearInterval(progressTimer);
  }

  logger.debug(`Deployment finished after ${Date.now() - startTime}ms`);
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

const uploadFiles = async (
  apiClient: KintoneRestAPIClient,
  files: string[],
  manifestDir: string,
  boundMessage: BoundMessage,
) => {
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
  return results;
};

const getUploadFilesResult = async (
  apiClient: KintoneRestAPIClient,
  manifest: CustomizeManifest,
  manifestDir: string,
  boundMessage: BoundMessage,
) => {
  const totalFiles =
    manifest.desktop.js.length +
    manifest.desktop.css.length +
    manifest.mobile.js.length +
    manifest.mobile.css.length;
  logger.debug(`Processing ${totalFiles} files for upload`);

  return {
    desktop: {
      js: await uploadFiles(
        apiClient,
        manifest.desktop.js,
        manifestDir,
        boundMessage,
      ),
      css: await uploadFiles(
        apiClient,
        manifest.desktop.css,
        manifestDir,
        boundMessage,
      ),
    },
    mobile: {
      js: await uploadFiles(
        apiClient,
        manifest.mobile.js,
        manifestDir,
        boundMessage,
      ),
      css: await uploadFiles(
        apiClient,
        manifest.mobile.css,
        manifestDir,
        boundMessage,
      ),
    },
  };
};

const createUpdatedManifest = (
  appId: string,
  manifest: CustomizeManifest,
  uploadFilesResult: Awaited<ReturnType<typeof getUploadFilesResult>>,
) => {
  return {
    app: appId,
    scope: manifest.scope,
    desktop: {
      js: uploadFilesResult.desktop.js,
      css: uploadFilesResult.desktop.css,
    },
    mobile: {
      js: uploadFilesResult.mobile.js,
      css: uploadFilesResult.mobile.css,
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
