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
import { getBoundMessage } from "../core";
import type { BoundMessage, CustomizeManifest } from "../core";

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
): Promise<void> => {
  const destDir = path.dirname(outputPath);

  logger.debug(`Exporting customization from app ${appId}`);
  logger.debug(`Output path: ${outputPath}`);

  await retry(
    async () => {
      logger.debug("Fetching app customization settings...");
      const resp = (await apiClient.app.getAppCustomize({
        app: appId,
      })) as GetAppCustomizeResp;

      logger.info(m("M_UpdateManifestFile"));
      writeManifestFile(destDir, outputPath, resp);

      logger.info(m("M_DownloadUploadedFile"));
      await downloadCustomizeFiles(apiClient, destDir, resp);
    },
    {
      onError: (e, attemptCount, toRetry, nextDelay, config) => {
        logger.debug(`Error occurred: ${e}`);
        if (toRetry) {
          logger.debug(
            `Retry attempt ${attemptCount}/${config.maxAttempt}, next delay: ${nextDelay}ms`,
          );
          logger.warn(m("E_Retry"));
        }
      },
    },
  );
};

const writeManifestFile = (
  destDir: string,
  outputPath: string,
  resp: GetAppCustomizeResp,
): GetAppCustomizeResp => {
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

  if (destDir && !fs.existsSync(destDir)) {
    logger.debug(`Creating directory: ${destDir}`);
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(customizeJson, null, 4));
  return resp;
};

const downloadCustomizeFiles = async (
  apiClient: KintoneRestAPIClient,
  destDir: string,
  { desktop, mobile }: GetAppCustomizeResp,
): Promise<void[]> => {
  const sep = path.sep;
  const desktopJs: CustomizeFile[] = desktop.js;
  const desktopCss: CustomizeFile[] = desktop.css;
  const mobileJs: CustomizeFile[] = mobile.js;
  const mobileCss: CustomizeFile[] = mobile.css;

  const totalFiles =
    desktopJs.length + desktopCss.length + mobileJs.length + mobileCss.length;
  logger.debug(`Downloading ${totalFiles} files to ${destDir}`);

  // Create directories
  const directories = [
    `${destDir}${sep}desktop${sep}js`,
    `${destDir}${sep}desktop${sep}css`,
    `${destDir}${sep}mobile${sep}js`,
    `${destDir}${sep}mobile${sep}css`,
  ];
  directories.forEach((dirPath) => {
    logger.debug(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  });

  const downloadPromises = [
    ...desktopJs.map(
      downloadAndWriteFile(apiClient, `${destDir}${sep}desktop${sep}js`),
    ),
    ...desktopCss.map(
      downloadAndWriteFile(apiClient, `${destDir}${sep}desktop${sep}css`),
    ),
    ...mobileJs.map(
      downloadAndWriteFile(apiClient, `${destDir}${sep}mobile${sep}js`),
    ),
    ...mobileCss.map(
      downloadAndWriteFile(apiClient, `${destDir}${sep}mobile${sep}css`),
    ),
  ];

  return Promise.all(downloadPromises);
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
    fs.writeFileSync(filePath, Buffer.from(resp));
    logger.debug(`Saved file: ${filePath}`);
  };
};

export const runExport = async (params: ExportParams): Promise<void> => {
  const { appId, outputPath, yes, ...restApiClientOptions } = params;
  const m = getBoundMessage("en");

  logger.debug(`Starting export for app ${appId}`);
  logger.debug(`Output path: ${outputPath}`);

  // Check if file already exists and prompt for overwrite
  if (fs.existsSync(outputPath) && !yes) {
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
  logger.info(m("M_CommandImportFinish"));
};
