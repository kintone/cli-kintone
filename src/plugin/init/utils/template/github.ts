import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { x } from "tar";
import { logger } from "../../../../utils/log";

const DEFAULT_TEMPLATE_REPO_USER = "kintone" as const;
const DEFAULT_TEMPLATE_REPO_NAME = "cli-kintone" as const;
const DEFAULT_TEMPLATE_BRANCH = "main" as const;
const DEFAULT_TEMPLATE_BASE_PATH = "plugin-templates" as const;

const DEFAULT_TEMPLATE_REPO =
  `${DEFAULT_TEMPLATE_REPO_USER}/${DEFAULT_TEMPLATE_REPO_NAME}` as const;

/**
 * Common function to call GitHub API
 * Automatically adds authentication header if GITHUB_TOKEN environment variable is set
 */
const fetchGitHubAPI = async (url: string, options?: RequestInit) => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const headers = new Headers(options?.headers);

  // Add authentication header if GITHUB_TOKEN is set
  if (process.env.GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }

  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  return fetch(url, {
    ...options,
    headers,
  });
};

export const isDefaultTemplateExists = async (
  name: string,
): Promise<boolean> => {
  try {
    const url = `https://api.github.com/repos/${DEFAULT_TEMPLATE_REPO}/contents/${DEFAULT_TEMPLATE_BASE_PATH}/${encodeURIComponent(
      name,
    )}?ref=${DEFAULT_TEMPLATE_BRANCH}`;

    logger.debug(`checking template existence: ${name}`);
    logger.debug(`fetching HEAD: ${url}`);
    const res = await fetchGitHubAPI(url, {
      method: "HEAD",
    });
    const exists = res.status === 200;
    logger.debug(`template ${name} ${exists ? "exists" : "does not exist"}`);
    return exists;
  } catch (error) {
    logger.debug(`error checking template: ${error}`);
    return false;
  }
};

export const downloadAndExtractTemplate = async (opts: {
  templateName: string;
  outputDir: string;
}) => {
  const url = `https://api.github.com/repos/${DEFAULT_TEMPLATE_REPO}/tarball/${DEFAULT_TEMPLATE_BRANCH}`;

  logger.debug(`downloading template tarball: ${url}`);
  const res = await fetchGitHubAPI(url);
  logger.debug("tarball download started");

  logger.debug(`extracting template: ${opts.outputDir}`);
  await pipeline(
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    Readable.fromWeb(res.body as ReadableStream),
    x({
      cwd: opts.outputDir,
      strip:
        1 +
        `${DEFAULT_TEMPLATE_BASE_PATH}/${opts.templateName}`.split("/").length,
      filter: (p) =>
        p.includes(
          `${DEFAULT_TEMPLATE_REPO_NAME}-${DEFAULT_TEMPLATE_BRANCH.replace("/", "-")}/${DEFAULT_TEMPLATE_BASE_PATH}/${opts.templateName}/`,
        ),
    }),
  );

  logger.debug(`template extracted: ${opts.outputDir} (${opts.templateName})`);
};
