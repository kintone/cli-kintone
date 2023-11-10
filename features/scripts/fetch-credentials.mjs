import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const kintoneBaseUrl = process.env.TEST_KINTONE_BASE_URL;
const kintoneAppId = process.env.TEST_KINTONE_CREDENTIAL_MANAGEMENT_APP_ID;
const kintoneApiToken =
  process.env.TEST_KINTONE_CREDENTIAL_MANAGEMENT_API_TOKEN;

if (!kintoneBaseUrl || !kintoneApiToken || !kintoneAppId) {
  console.error("Error: The environment variables are not set.");
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const client = new KintoneRestAPIClient({
  baseUrl: kintoneBaseUrl,
  auth: {
    apiToken: kintoneApiToken,
  },
});

const { records } = await client.record.getRecords({
  app: kintoneAppId,
});

records.forEach((record) => {
  record.api_tokens.value.forEach((apiToken) => {
    if (apiToken.value.token.value) {
      console.log(apiToken.value.token.value);
    }
  });
});
