import type { ErrorObject } from "ajv";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import fs from "fs";
import path from "path";
import Ajv from "ajv";
import * as core from "@actions/core";
import e2eCredentialsSchema from "../../e2e-credentials-schema.json";

type AppCredentialRecord = {
  key: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  app_id: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  guest_space_id: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  api_tokens: {
    type: "SUBTABLE";
    value: Array<{
      id: string;
      value: {
        token: {
          type: "SINGLE_LINE_TEXT";
          value: string;
        };
        permissions: {
          type: "CHECK_BOX";
          value: Permission[];
        };
      };
    }>;
  };
  user_permissions: {
    type: "SUBTABLE";
    value: Array<{
      id: string;
      value: {
        user_key: {
          type: "SINGLE_LINE_TEXT";
          value: string;
        };
        u_permissions: {
          type: "CHECK_BOX";
          value: Permission[];
        };
      };
    }>;
  };
};

type UserCredentialRecord = {
  key: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  username: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  password: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
};

export const TOKEN_PERMISSIONS = <const>["view", "add", "edit", "delete"];

export type Permission = (typeof TOKEN_PERMISSIONS)[number];

export type Credentials = {
  apps: AppCredential[];
  users: UserCredential[];
};

export type ApiToken = {
  token: string;
  permissions: Permission[];
};

export type AppCredential = {
  key: string;
  appId: string;
  guestSpaceId?: string;
  apiTokens: ApiToken[];
  userPermissions: UserPermission[];
};

export type UserPermission = {
  userKey: UserCredential["key"];
  permissions: Permission[];
};

export type UserCredential = {
  key: string;
  username: string;
  password: string;
};

const e2eCredentialFileName = ".e2e-credentials.json";
const e2eCredentialFilePath = path.join(
  __dirname,
  `../../${e2eCredentialFileName}`,
);

const isRunOnActions = () => !!process.env.GITHUB_ACTIONS;

export const loadCredentials: () => Promise<Credentials> = async () => {
  if (!isRunOnActions() && fs.existsSync(e2eCredentialFilePath)) {
    return loadFromFile();
  }

  const credentials = await loadFromKintone();
  if (isRunOnActions()) {
    setSecret(credentials);
  }

  return credentials;
};

const setSecret = (credentials: Credentials) => {
  credentials.apps.forEach((credential) => {
    credential.apiTokens.forEach((apiToken) => {
      if (apiToken.token.length > 0) {
        core.setSecret(apiToken.token);
      }
    });
  });
  credentials.users.forEach((credential) => {
    core.setSecret(credential.username);
    core.setSecret(credential.password);
  });
};

const loadFromFile: () => Promise<Credentials> = async () => {
  const jsonContent = JSON.parse(
    fs.readFileSync(e2eCredentialFilePath, "utf-8"),
  );

  const ajv = new Ajv();
  const validate = ajv.compile(e2eCredentialsSchema);
  const isValid = validate(jsonContent);
  if (!isValid) {
    const messages = generateErrorMessages(validate.errors ?? []);
    messages.forEach((msg) => {
      console.error(`- ${msg}`);
    });
    throw new Error(`Invalid JSON structure: ${e2eCredentialFileName}`);
  }

  console.log(`Loaded credentials from ${e2eCredentialFileName}`);
  return jsonContent as Credentials;
};

const generateErrorMessages = (errors: ErrorObject[]): string[] => {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.instancePath}" ${e.message} (${(
        e.params.allowedValues as any[]
      )
        .map((v) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.instancePath}" ${e.message}`;
  });
};

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
};

const loadFromKintone: () => Promise<Credentials> = async () => {
  const kintoneBaseUrl = getEnvVar("TEST_KINTONE_BASE_URL");
  const kintoneAppCMAAppId = getEnvVar(
    "TEST_KINTONE_CREDENTIAL_MANAGEMENT_APP_ID",
  );
  const kintoneAppCMAApiToken = getEnvVar(
    "TEST_KINTONE_CREDENTIAL_MANAGEMENT_API_TOKEN",
  );
  const kintoneUserCMAAppId = getEnvVar(
    "TEST_KINTONE_USER_CREDENTIAL_MANAGEMENT_APP_ID",
  );
  const kintoneUserCMAApiToken = getEnvVar(
    "TEST_KINTONE_USER_CREDENTIAL_MANAGEMENT_API_TOKEN",
  );

  const client = new KintoneRestAPIClient({
    baseUrl: kintoneBaseUrl,
    auth: {
      apiToken: [kintoneAppCMAApiToken, kintoneUserCMAApiToken],
    },
  });

  const { records: appCredentialRecords } =
    await client.record.getRecords<AppCredentialRecord>({
      app: kintoneAppCMAAppId,
    });
  const { records: userCredentialRecords } =
    await client.record.getRecords<UserCredentialRecord>({
      app: kintoneUserCMAAppId,
    });

  return {
    apps: appCredentialRecords.map(
      (r): AppCredential => ({
        key: r.key.value,
        appId: r.app_id.value,
        guestSpaceId: r.guest_space_id.value,
        apiTokens: r.api_tokens.value.map((row) => ({
          token: row.value.token.value,
          permissions: row.value.permissions.value,
        })),
        userPermissions: r.user_permissions.value.map((row) => ({
          userKey: row.value.user_key.value,
          permissions: row.value.u_permissions.value,
        })),
      }),
    ),
    users: userCredentialRecords.map(
      (r): UserCredential => ({
        key: r.key.value,
        username: r.username.value,
        password: r.password.value,
      }),
    ),
  };
};

export const getAppCredentialByAppKey = (
  appCredentials: AppCredential[],
  appKey: string,
): AppCredential | undefined => {
  return appCredentials.find((c) => c.key === appKey);
};

export const getAPITokenByAppAndPermissions = (
  appCredentials: AppCredential[],
  appKey: string,
  permissions: Permission[],
): ApiToken | undefined => {
  const appCredential = getAppCredentialByAppKey(appCredentials, appKey);
  if (!appCredential) {
    return undefined;
  }

  return appCredential.apiTokens.find((row: ApiToken) => {
    if (permissions.length === 0 && row.permissions.length === 0) {
      return true;
    }

    if (row.permissions.length !== permissions.length) {
      return false;
    }

    return permissions.every((value) => row.permissions.includes(value));
  });
};

export const getUserCredentialByUserKey = (
  userCredentials: UserCredential[],
  userKey: string,
): UserCredential | undefined => {
  return userCredentials.find((c) => c.key === userKey);
};

export const getUserCredentialByAppAndUserPermissions = (
  credentials: Credentials,
  appKey: string,
  permissions: Permission[],
): UserCredential | undefined => {
  const appCredential = getAppCredentialByAppKey(credentials.apps, appKey);
  if (!appCredential) {
    return undefined;
  }

  const userPermission = appCredential.userPermissions.find(
    (row: UserPermission) => {
      if (permissions.length === 0 && row.permissions.length === 0) {
        return true;
      }

      if (row.permissions.length !== permissions.length) {
        return false;
      }

      return permissions.every((value) => row.permissions.includes(value));
    },
  );

  if (!userPermission) {
    return undefined;
  }

  return getUserCredentialByUserKey(credentials.users, userPermission.userKey);
};
