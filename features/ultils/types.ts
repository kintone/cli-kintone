export type Permission = "view" | "add" | "edit" | "delete";

export type ApiToken = {
  token: string;
  permissions: Permission[];
};

export type Credential = {
  key: string;
  appId: string;
  apiTokens: ApiToken[];
};
