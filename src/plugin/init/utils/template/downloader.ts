import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { x } from "tar";
import { logger } from "../../../../utils/log";
import { fetchGitHubAPI } from "../../../../utils/github";

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

  logger.debug(`extracting template: ${opts.outputDir}`);
  const pathRegExp = new RegExp(`${opts.source.pathInTar}/.*`);
  await pipeline(
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    Readable.fromWeb(res.body as ReadableStream),
    x({
      cwd: opts.outputDir,
      // pathInTar (e.g., "plugin-templates/javascript") のセグメント数 + 1 stripする(root pathの 分)
      strip: opts.source.pathInTar.split("/").length + 1,
      filter: (p) => pathRegExp.test(p),
    }),
  );

  logger.debug(`template extracted: ${opts.outputDir}`);
};
