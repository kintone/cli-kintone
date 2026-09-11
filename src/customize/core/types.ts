/**
 * A permission granted to the customization when the Secure Option is used.
 *
 * The plugin manifest has a `permissions` property of the same name, but its
 * element also carries `scope`, which the customization settings do not have.
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
  // Secure Option settings. Unlike the properties above, leaving these out
  // keeps the current settings on the app instead of clearing them.
  permissions?: CustomizePermission[];
  allowed_hosts?: string[];
}
