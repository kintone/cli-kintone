import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { x } from "tar";
import { logger } from "../../../../utils/log";
import { fetchGitHubAPI } from "../../../core/utils/fetcher";
import { Writable, Transform } from "node:stream";

/**
 * Template source information
 */
export type TemplateSource = {
  /** Tarball download URL */
  tarballUrl: string;
  /** Path in tar (e.g., "cli-kintone-main/plugin-templates/javascript") */
  pathInTar: string;
};

/**
 * Download and extract template from specified URL
 * NOTE: Currently only supports GitHub API URLs due to authentication handling
 */
export const downloadAndExtractFromUrl = async (opts: {
  source: TemplateSource;
  outputDir: string;
}) => {
  logger.debug(`downloading template tarball: ${opts.source.tarballUrl}`);
  const res = await fetchGitHubAPI(opts.source.tarballUrl);
  logger.debug("tarball download started");

  if (!res.ok) {
    throw new Error(
      `Failed to download template tarball: ${res.status} ${res.statusText}`,
    );
  }
  if (res.body === null) {
    throw new Error("Failed to download template tarball: body is null");
  }

  logger.debug(`extracting template: ${opts.outputDir}`);
  await pipeline(
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    Readable.fromWeb(res.body as ReadableStream),
    x({
      cwd: opts.outputDir,
      strip: opts.source.pathInTar.split("/").length + 1,
      filter: (p) => p.includes(`${opts.source.pathInTar}/`),
    }),
  );

  logger.debug(`template extracted: ${opts.outputDir}`);
};
