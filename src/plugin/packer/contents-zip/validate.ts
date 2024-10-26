import type { ContentsZipInterface } from "./index";
import {
  generateErrorMessages,
  validateMaxFileSize,
  validateRelativePath,
} from "../manifest/validate";
import { ZipFileDriver } from "../driver";

/**
 * Validate a buffer of contents.zip
 */
export const validateContentsZip = async (
  contentsZip: ContentsZipInterface,
): Promise<void> => {
  const manifest = await contentsZip.manifest();

  // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
  // const getEntryKey = (filePath: string) =>
  //   filePath.replace(new RegExp(`\\${path.sep}`, "g"), "/");

  const zipFileDriver = new ZipFileDriver(contentsZip.buffer);
  await zipFileDriver.cacheEntries();

  const result = manifest.validate({
    relativePath: validateRelativePath(zipFileDriver),
    maxFileSize: validateMaxFileSize(zipFileDriver),
  });

  if (!result.valid) {
    const errors = generateErrorMessages(result.errors ?? []);
    const e: any = new Error(errors.join(", "));
    e.validationErrors = errors;
    throw e;
  }
};
