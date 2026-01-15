import fs from "fs";
import path from "path";
import { mkdirp } from "mkdirp";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
import {
  Constans,
  KintoneApiClient,
  AuthenticationError,
  getBoundMessage,
  wait,
} from "../core";
import type { BoundMessage, CustomizeManifest, Option } from "../core";

export interface ExportParams {
  appId: string;
  outputPath: string;
  yes: boolean;
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  basicAuthUsername: string | null;
  basicAuthPassword: string | null;
  options: Option;
}

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
  kintoneApiClient: KintoneApiClient,
  appId: string,
  outputPath: string,
  status: {
    retryCount: number;
  },
  options: Option,
  m: BoundMessage,
): Promise<void> => {
  const destDir = path.dirname(outputPath);
  let { retryCount } = status;

  try {
    const appCustomize = kintoneApiClient.getAppCustomize(appId);
    await appCustomize
      .then((resp: GetAppCustomizeResp) => {
        logger.info(m("M_UpdateManifestFile"));
        return writeManifestFile(destDir, outputPath, resp);
      })
      .then((resp: GetAppCustomizeResp) => {
        logger.info(m("M_DownloadUploadedFile"));
        return downloadCustomizeFiles(kintoneApiClient, destDir, resp);
      });
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < Constans.MAX_RETRY_COUNT) {
      await wait(1000);
      logger.warn(m("E_Retry"));
      await exportCustomizeSetting(
        kintoneApiClient,
        appId,
        outputPath,
        { retryCount },
        options,
        m,
      );
    } else {
      throw e;
    }
  }
};

const writeManifestFile = (
  destDir: string,
  outputPath: string,
  resp: GetAppCustomizeResp,
): GetAppCustomizeResp => {
  const toNameOrUrl = (fileDir: string) => (f: CustomizeFile) => {
    if (f.type === "FILE") {
      return `${fileDir}/${f.file.name}`;
    }
    return f.url;
  };

  const desktopJs: CustomizeFile[] = resp.desktop.js;
  const desktopCss: CustomizeFile[] = resp.desktop.css;
  const mobileJs: CustomizeFile[] = resp.mobile.js;
  const mobileCss: CustomizeFile[] = resp.mobile.css;

  // Manifest without app property (new spec)
  const customizeJson: CustomizeManifest = {
    scope: resp.scope,
    desktop: {
      js: desktopJs.map(toNameOrUrl(`${destDir}/desktop/js`)),
      css: desktopCss.map(toNameOrUrl(`${destDir}/desktop/css`)),
    },
    mobile: {
      js: mobileJs.map(toNameOrUrl(`${destDir}/mobile/js`)),
      css: mobileCss.map(toNameOrUrl(`${destDir}/mobile/css`)),
    },
  };

  if (destDir && !fs.existsSync(destDir)) {
    mkdirp.sync(destDir);
  }
  fs.writeFileSync(outputPath, JSON.stringify(customizeJson, null, 4));
  return resp;
};

const downloadCustomizeFiles = async (
  kintoneApiClient: KintoneApiClient,
  destDir: string,
  { desktop, mobile }: GetAppCustomizeResp,
): Promise<void[]> => {
  const sep = path.sep;
  const desktopJs: CustomizeFile[] = desktop.js;
  const desktopCss: CustomizeFile[] = desktop.css;
  const mobileJs: CustomizeFile[] = mobile.js;
  const mobileCss: CustomizeFile[] = mobile.css;

  // Create directories
  [
    `${destDir}${sep}desktop${sep}js`,
    `${destDir}${sep}desktop${sep}css`,
    `${destDir}${sep}mobile${sep}js`,
    `${destDir}${sep}mobile${sep}css`,
  ].forEach((dirPath) => mkdirp.sync(dirPath));

  const downloadPromises = [
    ...desktopJs.map(
      downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}desktop${sep}js`),
    ),
    ...desktopCss.map(
      downloadAndWriteFile(
        kintoneApiClient,
        `${destDir}${sep}desktop${sep}css`,
      ),
    ),
    ...mobileJs.map(
      downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}mobile${sep}js`),
    ),
    ...mobileCss.map(
      downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}mobile${sep}css`),
    ),
  ];

  return Promise.all(downloadPromises);
};

const downloadAndWriteFile = (
  kintoneApiClient: KintoneApiClient,
  destDir: string,
): ((f: CustomizeFile) => Promise<void>) => {
  return async (f) => {
    if (f.type !== "URL") {
      const resp = await kintoneApiClient.downloadFile(f.file.fileKey);
      fs.writeFileSync(
        `${destDir}${path.sep}${f.file.name}`,
        Buffer.from(resp),
      );
    }
  };
};

export const runExport = async (params: ExportParams): Promise<void> => {
  const {
    appId,
    outputPath,
    yes,
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    baseUrl,
    options,
  } = params;
  const m = getBoundMessage("en");

  // Check if file already exists and prompt for overwrite
  if (fs.existsSync(outputPath) && !yes) {
    const shouldOverwrite = await confirm({
      message: `File "${outputPath}" already exists. Overwrite?`,
      default: false,
    });
    if (!shouldOverwrite) {
      logger.info("Operation cancelled.");
      return;
    }
  }

  const status = {
    retryCount: 0,
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
  await exportCustomizeSetting(
    kintoneApiClient,
    appId,
    outputPath,
    status,
    options,
    m,
  );
  logger.info(m("M_CommandImportFinish"));
};
