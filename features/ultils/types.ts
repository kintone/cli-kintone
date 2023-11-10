export type Permission = "view" | "add" | "edit" | "delete";

export type Credential = {
  key: string;
  appId: string;
  apiTokens: Array<{
    token: string;
    permissions: Permission[];
  }>;
};
