import type { ContentsZipInterface } from "./index";
import type { Entries } from "../zip";
import type { ManifestInterface } from "../manifest";
import path from "path";
import { generateErrorMessages } from "../manifest/validate";

/**
 * Validate a buffer of contents.zip
 */
export const validateContentsZip = async (
  contentsZip: ContentsZipInterface,
): Promise<void> => {
  const entries = await contentsZip.entries();
  const manifest = await contentsZip.manifest();
  return validateManifest(entries, manifest);
};

const validateManifest = (entries: Entries, manifest: ManifestInterface) => {
  // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
  const getEntryKey = (filePath: string) =>
    filePath.replace(new RegExp(`\\${path.sep}`, "g"), "/");

  const result = manifest.validate({
    relativePath: (filePath) => entries.has(getEntryKey(filePath)),
    maxFileSize: (maxBytes, filePath) => {
      const entry = entries.get(getEntryKey(filePath));
      if (entry) {
        return entry.uncompressedSize <= maxBytes;
      }
      return false;
    },
  });

  if (!result.valid) {
    const errors = generateErrorMessages(result.errors ?? []);
    const e: any = new Error(errors.join(", "));
    e.validationErrors = errors;
    throw e;
  }
};
