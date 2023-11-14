import type { ErrorObject } from "ajv";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import fs from "fs";
import path from "path";
import Ajv from "ajv";
import * as core from "@actions/core";

type Record = {
  key: {
    type: "SINGLE_LINE_TEXT";
    value: string;
  };
  app_id: {
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
};

export const TOKEN_PERMISSIONS = <const>["view", "add", "edit", "delete"];

export type Permission = (typeof TOKEN_PERMISSIONS)[number];

export type ApiToken = {
  token: string;
  permissions: Permission[];
};

export type Credential = {
  key: string;
  appId: string;
  apiTokens: ApiToken[];
};

const e2eCredentialFileName = ".e2e-credentials.json";
const e2eCredentialFilePath = path.join(
  __dirname,
  `../../${e2eCredentialFileName}`,
);

const isRunOnActions = () => !!process.env.GITHUB_ACTIONS;

export const loadCredentials: () => Promise<Credential[]> = async () => {
  if (!isRunOnActions() && fs.existsSync(e2eCredentialFilePath)) {
    return loadFromFile();
  }

  const credentials = await loadFromKintone();
  if (isRunOnActions()) {
    credentials.forEach((credential) => {
      credential.apiTokens.forEach((apiToken) => {
        if (apiToken.token.length > 0) {
          core.setSecret(apiToken.token);
        }
      });
    });
  }

  return credentials;
};

const loadFromFile: () => Promise<Credential[]> = async () => {
  const jsonContent = JSON.parse(
    fs.readFileSync(e2eCredentialFilePath, "utf-8"),
  );

  const credentialsSchema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        key: { type: "string" },
        appId: { type: "string" },
        apiTokens: {
          type: "array",
          items: {
            type: "object",
            properties: {
              token: { type: "string" },
              permissions: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      required: ["key", "appId"],
    },
  };

  const ajv = new Ajv();
  const validate = ajv.compile(credentialsSchema);
  const isValid = validate(jsonContent);
  if (!isValid) {
    const messages = generateErrorMessages(validate.errors ?? []);
    messages.forEach((msg) => {
      console.error(`- ${msg}`);
    });
    throw new Error(`Invalid JSON structure: ${e2eCredentialFileName}`);
  }

  console.log(`Loaded credentials from ${e2eCredentialFileName}`);
  return jsonContent as Credential[];
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

const loadFromKintone: () => Promise<Credential[]> = async () => {
  const kintoneBaseUrl = process.env.TEST_KINTONE_BASE_URL;
  const kintoneAppId = process.env.TEST_KINTONE_CREDENTIAL_MANAGEMENT_APP_ID;
  const kintoneApiToken =
    process.env.TEST_KINTONE_CREDENTIAL_MANAGEMENT_API_TOKEN;

  if (!kintoneBaseUrl || !kintoneApiToken || !kintoneAppId) {
    throw new Error("Missing env variables");
  }

  const client = new KintoneRestAPIClient({
    baseUrl: kintoneBaseUrl,
    auth: {
      apiToken: kintoneApiToken,
    },
  });

  const { records } = await client.record.getRecords<Record>({
    app: kintoneAppId,
  });

  return records.map(
    (r): Credential => ({
      key: r.key.value,
      appId: r.app_id.value,
      apiTokens: r.api_tokens.value.map((row) => ({
        token: row.value.token.value,
        permissions: row.value.permissions.value,
      })),
    }),
  );
};

export const getCredentialByAppKey = (
  credentials: Credential[],
  appKey: string,
): Credential | undefined => {
  return credentials.find((c) => c.key === appKey);
};

export const getAPITokenByAppAndPermissions = (
  credentials: Credential[],
  appKey: string,
  permissions: Permission[],
): ApiToken | undefined => {
  const credential = getCredentialByAppKey(credentials, appKey);
  if (!credential) {
    return undefined;
  }

  return credential.apiTokens.find((row: ApiToken) => {
    if (permissions.length === 0 && row.permissions.length === 0) {
      return true;
    }

    if (row.permissions.length !== permissions.length) {
      return false;
    }

    return permissions.every((value) => row.permissions.includes(value));
  });
};
