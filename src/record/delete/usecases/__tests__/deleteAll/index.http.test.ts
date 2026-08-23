import { beforeAll, afterAll, beforeEach } from "vitest";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { deleteAllRecords } from "../../deleteAll";
import { DeleteAllRecordsError } from "../../deleteAll/error";
import {
  HttpTestServer,
  type CapturedRequest,
} from "../../../../../__tests__/helpers/httpTestServer";

/**
 * Characterization tests for deleteAllRecords: they pin the exact HTTP
 * requests `@kintone/rest-api-client` sends and the exact way cli-kintone
 * reacts to the responses, using a real node:http server instead of an
 * in-process mock. The point is that this test file keeps passing unchanged
 * whether the client is backed by axios (current) or fetch/undici (planned
 * migration) -- a regression in either direction should turn it red.
 */
describe("deleteAllRecords (HTTP level)", () => {
  let server: HttpTestServer;
  let apiClient: KintoneRestAPIClient;

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

  it("fetches record ids then sends a bulkRequest DELETE, and reports success", async () => {
    server.setHandler((req: CapturedRequest) => {
      if (req.method === "GET" && req.path === "/k/v1/records.json") {
        return {
          status: 200,
          body: {
            records: [
              { $id: { type: "__ID__", value: "1" } },
              { $id: { type: "__ID__", value: "2" } },
            ],
          },
        };
      }
      if (req.method === "POST" && req.path === "/k/v1/bulkRequest.json") {
        return { status: 200, body: { results: [{}] } };
      }
      throw new Error(`Unexpected request: ${req.method} ${req.path}`);
    });

    await expect(deleteAllRecords(apiClient, "1")).resolves.not.toThrow();

    expect(server.requests).toHaveLength(2);

    const [getRecords, bulkRequest] = server.requests;

    expect(getRecords.method).toBe("GET");
    expect(getRecords.path).toBe("/k/v1/records.json");
    expect(getRecords.query.get("app")).toBe("1");
    expect(getRecords.query.getAll("fields[0]")).toEqual(["$id"]);
    expect(getRecords.headers["x-cybozu-api-token"]).toBe("dummy-api-token");

    expect(bulkRequest.method).toBe("POST");
    expect(bulkRequest.path).toBe("/k/v1/bulkRequest.json");
    expect(bulkRequest.headers["content-type"]).toContain("application/json");
    expect(bulkRequest.headers["x-cybozu-api-token"]).toBe("dummy-api-token");
    expect(bulkRequest.body).toStrictEqual({
      requests: [
        {
          api: "/k/v1/records.json",
          method: "DELETE",
          payload: { app: "1", ids: [1, 2], revisions: [null, null] },
        },
      ],
    });
  });

  it("does not call bulkRequest when the app has no records", async () => {
    server.setHandler((req: CapturedRequest) => {
      if (req.method === "GET" && req.path === "/k/v1/records.json") {
        return { status: 200, body: { records: [] } };
      }
      throw new Error(`Unexpected request: ${req.method} ${req.path}`);
    });

    await expect(deleteAllRecords(apiClient, "1")).resolves.not.toThrow();

    expect(server.requests).toHaveLength(1);
    expect(server.requests[0].path).toBe("/k/v1/records.json");
  });

  it("wraps a kintone API error from bulkRequest into DeleteAllRecordsError", async () => {
    server.setHandler((req: CapturedRequest) => {
      if (req.method === "GET" && req.path === "/k/v1/records.json") {
        return { status: 200, body: { records: [{ $id: { value: "1" } }] } };
      }
      if (req.method === "POST" && req.path === "/k/v1/bulkRequest.json") {
        return {
          status: 500,
          body: {
            code: "GAIA_IL22",
            id: "test-request-id",
            message: "予期しないエラーが発生しました。",
          },
        };
      }
      throw new Error(`Unexpected request: ${req.method} ${req.path}`);
    });

    const error = await deleteAllRecords(apiClient, "1").catch((e) => e);

    expect(error).toBeInstanceOf(DeleteAllRecordsError);
    expect(error.detail).toBe("No records are deleted.");

    // Confirms the failure actually came from the scripted 500 response and
    // not from an unexpected request path hitting the handler's throw
    // (which HttpTestServer turns into its own 500 with a different body
    // shape) -- those two failure modes would otherwise be indistinguishable
    // from the assertions above alone.
    expect(server.requests).toHaveLength(2);
    expect(server.requests[1].path).toBe("/k/v1/bulkRequest.json");
  });
});
