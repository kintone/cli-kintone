import type { Lang } from "./lang";

export interface CustomizeManifest {
  app: string;
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
  watch?: string;
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
}
