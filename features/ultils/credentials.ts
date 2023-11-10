import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { Credential, Permission } from "./types";
import fs from "fs";
import path from "path";
import Ajv from "ajv";
import type { ErrorObject } from "ajv";

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

const e2eCredentialFileName = ".e2e-credentials.json";
const e2eCredentialFilePath = path.join(
  __dirname,
  `../../${e2eCredentialFileName}`,
);

export const fetchCredentials: () => Promise<Credential[]> = async () => {
  if (!process.env.CI && fs.existsSync(e2eCredentialFilePath)) {
    return fetchFromFile();
  }

  return fetchFromKintone();
};

const fetchFromFile: () => Promise<Credential[]> = async () => {
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

const fetchFromKintone: () => Promise<Credential[]> = async () => {
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
      apiTokens: r.api_tokens.value
        ? r.api_tokens.value.map((row) => ({
            token: row.value.token.value,
            permissions: row.value.permissions.value,
          }))
        : [],
    }),
  );
};
