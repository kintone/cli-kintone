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

export interface GeneralInputParams {
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  basicAuthUsername: string | null;
  basicAuthPassword: string | null;
  manifestFile: string;
}

export interface Option {
  proxy: string;
  guestSpaceId: number;
}
