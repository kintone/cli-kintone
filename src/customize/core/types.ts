import type { ManifestPermission } from "../../plugin/core/manifest/interface";

/**
 * An element of the `permissions` property of the customize manifest file.
 *
 * It has the same shape as the plugin manifest's element, so that one manifest
 * of permissions can be moved between a plugin and a customization.
 */
export type CustomizePermission = ManifestPermission;

export interface CustomizeManifest {
  app?: string; // Optional for backward compatibility
  scope: "ALL" | "ADMIN" | "NONE";
  desktop: {
    js: string[];
    css: string[];
  };
  mobile: {
    js: string[];
    css: string[];
  };
  // Sandbox settings. Unlike `scope` / `desktop` / `mobile`, leaving these
  // out keeps the current settings on the app instead of clearing them.
  permissions?: CustomizePermission[];
  allowed_hosts?: string[];
}
