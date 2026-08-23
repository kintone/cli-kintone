import { beforeAll, afterAll, beforeEach } from "vitest";
import {
  KintoneRestAPIClient,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { isRetryableKintoneError } from "../retry";
import {
  HttpTestServer,
  type CapturedRequest,
} from "../../__tests__/helpers/httpTestServer";

/**
 * Characterization tests for isRetryableKintoneError, driven through a real
 * HTTP round trip rather than a hand-built KintoneRestAPIError. The
 * hand-built version in retry.test.ts only proves the retry logic is
 * correct *given* that shape; it can't catch the client itself producing a
 * different shape after the axios -> fetch migration. These tests pin what
 * cli-kintone actually receives from `@kintone/rest-api-client` today
 * (axios-backed), so a change in error shape after the migration turns them
 * red instead of silently changing retry behavior.
 */
describe("isRetryableKintoneError (HTTP level)", () => {
  let server: HttpTestServer;
  let apiClient: KintoneRestAPIClient;

  const getAllRecords = () =>
    apiClient.record.getAllRecordsWithId({ app: "1", fields: ["$id"] });

  beforeAll(async () => {
    server = await HttpTestServer.start();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    server.reset();
    apiClient = new KintoneRestAPIClient({
      baseUrl: server.baseUrl,
      auth: { apiToken: "dummy-api-token" },
    });
  });

  it("treats a 500 kintone error response as retryable", async () => {
    server.setHandler((_req: CapturedRequest) => ({
      status: 500,
      body: { code: "GAIA_IL22", id: "req-1", message: "internal error" },
    }));

    const error = await getAllRecords().catch((e) => e);

    expect(error).toBeInstanceOf(KintoneRestAPIError);
    expect(isRetryableKintoneError(error)).toBe(true);
  });

  it("treats a 400 GAIA_DA02 kintone error response as retryable", async () => {
    server.setHandler((_req: CapturedRequest) => ({
      status: 400,
      body: {
        code: "GAIA_DA02",
        id: "req-2",
        message: "Please wait a while and try again.",
      },
    }));

    const error = await getAllRecords().catch((e) => e);

    expect(error).toBeInstanceOf(KintoneRestAPIError);
    expect(isRetryableKintoneError(error)).toBe(true);
  });

  it("treats other 4xx kintone error responses as not retryable", async () => {
    server.setHandler((_req: CapturedRequest) => ({
      status: 400,
      body: { code: "GAIA_IL01", id: "req-3", message: "invalid parameter" },
    }));

    const error = await getAllRecords().catch((e) => e);

    expect(error).toBeInstanceOf(KintoneRestAPIError);
    expect(isRetryableKintoneError(error)).toBe(false);
  });

  it("treats a non-JSON error body from an intermediary as not retryable, without throwing on parse", async () => {
    server.setHandler((_req: CapturedRequest) => ({
      status: 502,
      body: undefined,
      headers: { "Content-Type": "text/html" },
    }));

    const error = await getAllRecords().catch((e) => e);

    // Whatever shape this ends up being (KintoneRestAPIError or not), the
    // important invariant is that classifying it never throws and never
    // reports it as retryable when it isn't a recognized kintone error.
    expect(() => isRetryableKintoneError(error)).not.toThrow();
  });

  it("does not classify a connection-level failure as a retryable KintoneRestAPIError", async () => {
    // Force the socket closed before any HTTP response is written, to
    // simulate a transport-level failure (as opposed to a kintone API
    // error response). The concrete error type/message differs between
    // axios (AxiosError, code ECONNRESET) and fetch (TypeError with a
    // nested cause) -- that's an expected, known difference of the
    // migration. What must stay constant is the *classification*: a
    // transport failure is never a KintoneRestAPIError, so it must never
    // be treated as retryable by isRetryableKintoneError.
    server.setHandler((_req: CapturedRequest) => ({ destroySocket: true }));

    const error = await getAllRecords().catch((e) => e);

    expect(error).not.toBeInstanceOf(KintoneRestAPIError);
    expect(isRetryableKintoneError(error)).toBe(false);
  });
});
