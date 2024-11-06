import type { ManifestV2JsonObject } from "./index";

/**
 * Create contents file list from manifest.json
 */
export const sourceListV2 = (manifest: ManifestV2JsonObject): string[] => {
  const list: string[] = [];
  list.push("manifest.json", manifest.icon);

  const filesInComponents =
    manifest.components
      ?.map((component) => {
        return ([] as string[]).concat(
          component.js?.filter((s) => !isURL(s)) ?? [],
          component.css?.filter((s) => !isURL(s)) ?? [],
          component.html ?? [],
        );
      })
      .flat() ?? [];
  list.push(...filesInComponents);

  const filesInConfig = ([] as string[]).concat(
    manifest.config?.html ?? [],
    manifest.config?.js?.filter((s) => !isURL(s)) ?? [],
    manifest.config?.css?.filter((s) => !isURL(s)) ?? [],
  );
  list.push(...filesInConfig);

  // Make the file list unique
  return Array.from(new Set(list));
};

const isURL = (input: string) => /^https?:\/\//.test(input);
