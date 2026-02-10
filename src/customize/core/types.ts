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
}
