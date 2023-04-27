import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as packageJson from "../../package.json";
import httpsProxyAgent from "https-proxy-agent";
import * as https from "https";
import fs from "fs";

export type RestAPIClientOptions = {
  baseUrl: string;
  username?: string;
  password?: string;
  basicAuthUsername?: string;
  basicAuthPassword?: string;
  apiToken?: string | string[];
  guestSpaceId?: string;
  pfxFilePath?: string;
  pfxFilePassword?: string;
  userAgent?: string;
  httpsProxy?: string;
};

const buildAuthParam = (options: RestAPIClientOptions) => {
  const passwordAuthParam = {
    username: options.username,
    password: options.password,
  };

  if (options.username) {
    return passwordAuthParam;
  }
  if (options.apiToken) {
    return { apiToken: options.apiToken };
  }
  return passwordAuthParam;
};

const buildBasicAuthParam = (options: RestAPIClientOptions) => {
  return options.basicAuthUsername && options.basicAuthPassword
    ? {
        basicAuth: {
          username: options.basicAuthUsername,
          password: options.basicAuthPassword,
        },
      }
    : {};
};

const buildHttpsAgent = (options: {
  proxy?: string;
  pfxFilePath?: string;
  pfxFilePassword?: string;
}): https.Agent => {
  let pfx: string | Buffer | undefined;
  if (options.pfxFilePath !== undefined) {
    pfx = fs.readFileSync(options.pfxFilePath);
  }
  const clientAuth =
    pfx && options.pfxFilePassword
      ? { pfx, passphrase: options.pfxFilePassword }
      : {};
  if (!options.proxy) {
    return new https.Agent({ ...clientAuth });
  }

  const { protocol, hostname, port, username, password } = new URL(
    options.proxy
  );
  const proxyOptions: httpsProxyAgent.HttpsProxyAgentOptions = {
    protocol: protocol,
    host: hostname,
    port: port,
    ...clientAuth,
  };

  if (username.length > 0 && password.length > 0) {
    proxyOptions.headers = {
      "Proxy-Authorization": generateProxyAuthorizationHeaderValue(
        username,
        password
      ),
    };
  }

  return httpsProxyAgent(proxyOptions);
};

const generateProxyAuthorizationHeaderValue = (
  username: string,
  password: string
): string => {
  return "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
};

export const buildRestAPIClient = (options: RestAPIClientOptions) => {
  return new KintoneRestAPIClient({
    baseUrl: options.baseUrl,
    auth: buildAuthParam(options),
    ...buildBasicAuthParam(options),
    ...(options.guestSpaceId ? { guestSpaceId: options.guestSpaceId } : {}),
    userAgent: `${packageJson.name}@${packageJson.version}`,
    // TODO: fix type definition of @kintone/rest-api-client
    // Currently, the proxy property doesn't accept false
    proxy: false as any,
    httpsAgent: buildHttpsAgent({
      proxy: options.httpsProxy,
      pfxFilePath: options.pfxFilePath,
      pfxFilePassword: options.pfxFilePassword,
    }),
  });
};
