import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
import { retry } from "../../utils/retry";
import {
  KintoneApiClient,
  AuthenticationError,
  getBoundMessage,
  isUrlString,
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

export const apply = async (
  kintoneApiClient: KintoneApiClient,
  appId: string,
  manifest: CustomizeManifest,
  manifestDir: string,
  boundMessage: BoundMessage,
): Promise<void> => {
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
            kintoneApiClient,
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
          await kintoneApiClient.updateCustomizeSetting(uploadedManifest);
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
    },
    {
      retryCondition: (e) => !(e instanceof AuthenticationError),
      onError: (e, attemptCount, toRetry, nextDelay, config) => {
        logger.debug(`Error occurred: ${e}`);
        if (e instanceof AuthenticationError) {
          logger.debug("Authentication error detected, not retrying");
        } else if (toRetry) {
          logger.debug(
            `Retry attempt ${attemptCount}/${config.maxAttempt}, next delay: ${nextDelay}ms`,
          );
          logger.warn(boundMessage("E_Retry"));
        }
      },
    },
  );
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

const getUploadFilesResult = async (
  kintoneApiClient: KintoneApiClient,
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
      const result = await kintoneApiClient.prepareCustomizeFile(resolvedPath);
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

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    baseUrl,
    options,
  );

  await apply(kintoneApiClient, appId, manifest, manifestDir, boundMessage);
};
