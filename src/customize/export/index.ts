import fs from "fs/promises";
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
import { getBoundMessage } from "../core";
import type { BoundMessage, CustomizeManifest } from "../core";
import { isFile } from "../../utils/file";

export type ExportParams = RestAPIClientOptions & {
  appId: string;
  outputPath: string;
  yes: boolean;
};

interface UploadedFile {
  type: "FILE";
  file: {
    fileKey: string;
    name: string;
  };
}

interface CDNFile {
  type: "URL";
  url: string;
}
type CustomizeFile = UploadedFile | CDNFile;

interface GetAppCustomizeResp {
  scope: "ALL" | "ADMIN" | "NONE";
  desktop: {
    js: CustomizeFile[];
    css: CustomizeFile[];
  };
  mobile: {
    js: CustomizeFile[];
    css: CustomizeFile[];
  };
}

export const exportCustomizeSetting = async (
  apiClient: KintoneRestAPIClient,
  appId: string,
  outputPath: string,
  m: BoundMessage,
) => {
  const destDir = path.dirname(outputPath);

  logger.debug(`Exporting customization from app ${appId}`);
  logger.debug(`Output path: ${outputPath}`);

  logger.info(m("M_GenerateManifestFile"));
  logger.info(m("M_DownloadUploadedFile"));

  await retry(
    async () => {
      logger.debug("Fetching app customization settings...");
      const resp = await apiClient.app.getAppCustomize({
        app: appId,
      });

      await writeManifestFile(destDir, outputPath, resp);

      await downloadCustomizeFiles(apiClient, destDir, resp);
    },
    {
      retryCondition: (e: unknown) =>
        e instanceof KintoneRestAPIError && e.status >= 500 && e.status < 600,
      onError: (e, attemptCount, toRetry, _nextDelay, config) => {
        logger.debug(`Error occurred: ${e}`);
        if (toRetry) {
          logger.debug(
            `Retry attempt ${attemptCount}/${config.maxAttempt}, next delay: ${_nextDelay}ms`,
          );
          logger.warn(m("E_Retry"));
        }
      },
    },
  );
};

const writeManifestFile = async (
  destDir: string,
  outputPath: string,
  resp: GetAppCustomizeResp,
) => {
  // Generate paths relative to manifest file location
  const toNameOrUrl = (relativeDir: string) => (f: CustomizeFile) => {
    if (f.type === "FILE") {
      return `${relativeDir}/${f.file.name}`;
    }
    return f.url;
  };

  const desktopJs: CustomizeFile[] = resp.desktop.js;
  const desktopCss: CustomizeFile[] = resp.desktop.css;
  const mobileJs: CustomizeFile[] = resp.mobile.js;
  const mobileCss: CustomizeFile[] = resp.mobile.css;

  logger.debug(`Writing manifest to: ${outputPath}`);
  logger.debug(
    `Files: desktop.js=${desktopJs.length}, desktop.css=${desktopCss.length}, mobile.js=${mobileJs.length}, mobile.css=${mobileCss.length}`,
  );

  // Manifest with paths relative to manifest file location
  const customizeJson: CustomizeManifest = {
    scope: resp.scope,
    desktop: {
      js: desktopJs.map(toNameOrUrl("desktop/js")),
      css: desktopCss.map(toNameOrUrl("desktop/css")),
    },
    mobile: {
      js: mobileJs.map(toNameOrUrl("mobile/js")),
      css: mobileCss.map(toNameOrUrl("mobile/css")),
    },
  };

  logger.debug(`Creating directory: ${destDir}`);
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(customizeJson, null, 4));
};

const downloadCustomizeFiles = async (
  apiClient: KintoneRestAPIClient,
  destDir: string,
  { desktop, mobile }: GetAppCustomizeResp,
) => {
  const fileCategories = [
    { files: desktop.js, subDir: "desktop/js" },
    { files: desktop.css, subDir: "desktop/css" },
    { files: mobile.js, subDir: "mobile/js" },
    { files: mobile.css, subDir: "mobile/css" },
  ];

  const totalFiles = fileCategories.reduce(
    (sum, category) => sum + category.files.length,
    0,
  );
  logger.debug(`Downloading ${totalFiles} files to ${destDir}`);

  // Create directories and download files in parallel
  const downloadPromises = fileCategories.map(async ({ files, subDir }) => {
    const dirPath = path.join(destDir, subDir);
    logger.debug(`Creating directory: ${dirPath}`);
    await fs.mkdir(dirPath, { recursive: true });
    return Promise.all(files.map(downloadAndWriteFile(apiClient, dirPath)));
  });

  await Promise.all(downloadPromises);
};

const downloadAndWriteFile = (
  apiClient: KintoneRestAPIClient,
  destDir: string,
): ((f: CustomizeFile) => Promise<void>) => {
  return async (f) => {
    if (f.type === "URL") {
      logger.debug(`Skipping URL file: ${f.url}`);
      return;
    }
    logger.debug(
      `Downloading file: ${f.file.name} (fileKey: ${f.file.fileKey})`,
    );
    const resp = await apiClient.file.downloadFile({ fileKey: f.file.fileKey });
    const filePath = `${destDir}${path.sep}${f.file.name}`;
    await fs.writeFile(filePath, Buffer.from(resp));
    logger.debug(`Saved file: ${filePath}`);
  };
};

export const runExport = async (params: ExportParams) => {
  const { appId, outputPath, yes, ...restApiClientOptions } = params;
  const m = getBoundMessage("en");

  logger.debug(`Starting export for app ${appId}`);
  logger.debug(`Output path: ${outputPath}`);

  // Check if file already exists and prompt for overwrite
  if ((await isFile(outputPath)) && !yes) {
    logger.debug(`File already exists: ${outputPath}`);
    const shouldOverwrite = await confirm({
      message: `File "${outputPath}" already exists. Overwrite?`,
      default: false,
    });
    if (!shouldOverwrite) {
      logger.info("Operation cancelled.");
      return;
    }
  }

  const apiClient = buildRestAPIClient(restApiClientOptions);
  await exportCustomizeSetting(apiClient, appId, outputPath, m);
  logger.info(m("M_CommandExportFinish"));
};
