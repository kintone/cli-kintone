import type { ManifestV1JsonObject } from "./index";

/**
 * Create content file list from manifest.json
 */
export const sourceList = (manifest: ManifestV1JsonObject): string[] => {
  const list = ([] as string[]).concat(
    manifest.desktop?.js?.filter((s) => !isURL(s)) ?? [],
    manifest.desktop?.css?.filter((s) => !isURL(s)) ?? [],
    manifest.mobile?.js?.filter((s) => !isURL(s)) ?? [],
    manifest.mobile?.css?.filter((s) => !isURL(s)) ?? [],
    manifest.config?.js?.filter((s) => !isURL(s)) ?? [],
    manifest.config?.css?.filter((s) => !isURL(s)) ?? [],
    manifest.config?.html ?? [],
    ["manifest.json", manifest.icon],
  );

  // Make the file list unique
  return Array.from(new Set(list));
};

const isURL = (input: string) => /^https?:\/\//.test(input);
