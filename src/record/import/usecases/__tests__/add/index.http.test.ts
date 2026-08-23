import { beforeAll, afterAll, beforeEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordSchema } from "../../../types/schema";
import type { LocalRecord } from "../../../types/record";
import { addRecords } from "../../add";
import { LocalRecordRepositoryMock } from "../../../repositories/localRecordRepositoryMock";
import {
  HttpTestServer,
  parseMultipartFormData,
  type CapturedRequest,
} from "../../../../../__tests__/helpers/httpTestServer";

/**
 * Characterization test for the FILE field upload path: addRecords ->
 * apiClient.file.uploadFile -> multipart/form-data POST /k/v1/file.json.
 * This targets the axios -> fetch migration's riskiest surface for this
 * repo (js-sdk's fix bd0eb710 "support Stream fields in form-data body for
 * fetch"): cli-kintone passes a filesystem path, which rest-api-client
 * turns into a read stream. A large-ish file is used so the body is
 * genuinely streamed across multiple chunks rather than landing in one.
 *
 * Deliberately not asserted: Content-Length vs Transfer-Encoding framing.
 * A stream body may legitimately switch from a known Content-Length under
 * axios to chunked transfer-encoding under fetch/undici -- that's a valid
 * difference in HTTP framing, not a behavioral regression.
 */
describe("addRecords file upload (HTTP level)", () => {
  let server: HttpTestServer;
  let apiClient: KintoneRestAPIClient;
  let attachmentsDir: string;
  let fileBytes: Buffer;

  const RELATIVE_FILE_PATH = path.join("nested", "large-attachment.bin");

  beforeAll(async () => {
    server = await HttpTestServer.start();

    attachmentsDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "cli-kintone-http-test-"),
    );
    fs.mkdirSync(path.join(attachmentsDir, "nested"));
    // Comfortably over a typical stream highWaterMark (64KB) so the body is
    // read and forwarded across multiple chunks instead of a single one.
    fileBytes = Buffer.alloc(256 * 1024);
    for (let i = 0; i < fileBytes.length; i++) {
      fileBytes[i] = i % 256;
    }
    fs.writeFileSync(path.join(attachmentsDir, RELATIVE_FILE_PATH), fileBytes);
  });

  afterAll(async () => {
    await server.close();
    fs.rmSync(attachmentsDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    server.reset();
    apiClient = new KintoneRestAPIClient({
      baseUrl: server.baseUrl,
      auth: { apiToken: "dummy-api-token" },
    });
  });

  it("streams the attachment as multipart/form-data and forwards the returned fileKey", async () => {
    const schema: RecordSchema = {
      fields: [
        {
          type: "FILE",
          code: "attachment",
          label: "attachment",
          noLabel: false,
          required: false,
          thumbnailSize: "150",
        },
      ],
    };
    const records: LocalRecord[] = [
      {
        data: {
          attachment: {
            value: [{ localFilePath: RELATIVE_FILE_PATH }],
          },
        },
        metadata: {
          format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
        },
      },
    ];
    const repository = new LocalRecordRepositoryMock(records, "csv");

    server.setHandler((req: CapturedRequest) => {
      if (req.method === "POST" && req.path === "/k/v1/file.json") {
        return { status: 200, body: { fileKey: "uploaded-file-key" } };
      }
      if (req.method === "POST" && req.path === "/k/v1/bulkRequest.json") {
        return {
          status: 200,
          body: { results: [{ ids: ["1"], revisions: ["1"] }] },
        };
      }
      throw new Error(`Unexpected request: ${req.method} ${req.path}`);
    });

    await expect(
      addRecords(apiClient, "1", repository, schema, { attachmentsDir }),
    ).resolves.not.toThrow();

    const uploadRequests = server.requests.filter(
      (r) => r.path === "/k/v1/file.json",
    );
    expect(uploadRequests).toHaveLength(1);
    const [uploadRequest] = uploadRequests;
    expect(uploadRequest.headers["content-type"]).toContain(
      "multipart/form-data",
    );

    const parts = parseMultipartFormData(uploadRequest);
    expect(parts).toHaveLength(1);
    expect(parts[0].name).toBe("file");
    expect(parts[0].filename).toBe("large-attachment.bin");
    // The exact bytes the server received must match the source file --
    // this is the assertion the multipart/stream migration risk is about.
    expect(Buffer.compare(parts[0].data, fileBytes)).toBe(0);

    const bulkRequests = server.requests.filter(
      (r) => r.path === "/k/v1/bulkRequest.json",
    );
    expect(bulkRequests).toHaveLength(1);
    const [bulkRequest] = bulkRequests;
    expect(bulkRequest.body).toStrictEqual({
      requests: [
        {
          api: "/k/v1/records.json",
          method: "POST",
          payload: {
            app: "1",
            records: [
              { attachment: { value: [{ fileKey: "uploaded-file-key" }] } },
            ],
          },
        },
      ],
    });
  });
});
