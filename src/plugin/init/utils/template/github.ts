import { logger } from "../../../../utils/log";
import type { TemplateSource } from "./downloader";
import { fetchGitHubAPI } from "../../../core/utils/fetcher";

const DEFAULT_TEMPLATE_REPO_USER = "kintone" as const;
const DEFAULT_TEMPLATE_REPO_NAME = "cli-kintone" as const;
const DEFAULT_TEMPLATE_BRANCH = "main" as const;
const DEFAULT_TEMPLATE_BASE_PATH = "plugin-templates" as const;

const DEFAULT_TEMPLATE_REPO =
  `${DEFAULT_TEMPLATE_REPO_USER}/${DEFAULT_TEMPLATE_REPO_NAME}` as const;

/**
 * Resolve template name from GitHub's default template repository
 * Also performs existence check internally
 * @param templateName Template name (e.g., "javascript", "typescript")
 * @returns Template source information
 * @throws Error if template does not exist
 */
export const resolveGitHubTemplateSource = async (
  templateName: string,
): Promise<TemplateSource> => {
  // Perform existence check internally
  if (!(await isGitHubTemplateExists(templateName))) {
    throw new Error(`GitHub template "${templateName}" not found`);
  }

  return {
    tarballUrl: `https://api.github.com/repos/${DEFAULT_TEMPLATE_REPO}/tarball/${DEFAULT_TEMPLATE_BRANCH}`,
    pathInTar: `${DEFAULT_TEMPLATE_BASE_PATH}/${templateName}`,
  };
};

/**
 * Check if template exists in GitHub's default template repository
 * @param name Template name
 * @returns true if template exists
 */
export const isGitHubTemplateExists = async (
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
    logger.debug(
      `template ${name} ${exists ? "exists" : "does not exist, status = " + res.status}`,
    );
    return exists;
  } catch (error) {
    logger.debug(`error checking template: ${error}`);
    return false;
  }
};
