import { Readable } from "stream";
import { x } from "tar";
import { logger } from "../../../../utils/log";

const DEFAULT_TEMPLATE_REPO_USER = "kintone" as const;
const DEFAULT_TEMPLATE_REPO_NAME = "cli-kintone" as const;
const DEFAULT_TEMPLATE_BRANCH = "main" as const;
const DEFAULT_TEMPLATE_BASE_PATH = "plugin-templates" as const;

const DEFAULT_TEMPLATE_REPO =
  `${DEFAULT_TEMPLATE_REPO_USER}/${DEFAULT_TEMPLATE_REPO_NAME}` as const;

export const isDefaultTemplateExists = async (
  name: string,
): Promise<boolean> => {
  try {
    const url = `https://api.github.com/repos/${DEFAULT_TEMPLATE_REPO}/contents/${DEFAULT_TEMPLATE_BASE_PATH}/${encodeURIComponent(
      name,
    )}?ref=${DEFAULT_TEMPLATE_BRANCH}`;

    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const res = await fetch(url, {
      method: "HEAD",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    });
    logger.debug(`fetch HEAD: ${url}`);
    return res.status === 200;
  } catch {
    return false;
  }
};

export const downloadAndExtractTemplate = async (opts: {
  templateName: string;
  outputDir: string;
}) => {
  const url = `https://codeload.github.com/${DEFAULT_TEMPLATE_REPO}/tar.gz/${DEFAULT_TEMPLATE_BRANCH}`;
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const res = await fetch(url);

  logger.debug(`download template tar: ${url}`);

  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  Readable.fromWeb(res.body as ReadableStream).pipe(
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
  logger.debug(
    `template tar extracted: path = ${opts.outputDir}, templateName = ${opts.templateName}`,
  );
};
