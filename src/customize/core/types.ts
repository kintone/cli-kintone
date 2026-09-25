/**
 * An element of the `permissions` property of the customize manifest file.
 *
 * `scope` is accepted so that a plugin manifest's entry can be copied as it is,
 * but kintone ignores it for a customization.
 */
export type CustomizePermission = {
  permission: string;
  scope?: string;
};

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
