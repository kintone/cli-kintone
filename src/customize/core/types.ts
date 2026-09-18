/**
 * An element of the `permissions` property of the customize manifest file.
 *
 * The plugin manifest counterpart is `ManifestPermission`
 * (`src/plugin/core/manifest/interface.ts`), whose element also carries `scope`.
 */
export interface CustomizePermission {
  permission: string;
}

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
