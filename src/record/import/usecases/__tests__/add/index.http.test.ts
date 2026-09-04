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
  type CapturedRequest,
} from "../../../../../__tests__/helpers/httpTestServer";
import { parseMultipartFormData } from "../../../../../__tests__/helpers/multipartFormData";

/**
 * Characterization test for the FILE field upload path: addRecords ->
 * apiClient.file.uploadFile -> multipart/form-data POST /k/v1/file.json.
 * This targets the axios -> fetch migration's riskiest surface for this
 * repo (js-sdk's fix bd0eb710 "support Stream fields in form-data body for
 * fetch"): cli-kintone passes a filesystem path, which rest-api-client
 * turns into a read stream. A large-ish, non-repeating file is used so the
 * body is comfortably read across multiple stream chunks (a typical
 * highWaterMark is 64KB) rather than in one -- though this test only
 * asserts the resulting bytes are correct on the receiving end, not the
 * chunking itself (HttpTestServer reassembles the body before exposing it,
 * so a single-chunk send would look identical here).
 *
 * Deliberately not asserted: Content-Length vs Transfer-Encoding framing.
 * A stream body may legitimately switch from a known Content-Length under
 * axios to chunked transfer-encoding under fetch/undici -- that's a valid
 * difference in HTTP framing, not a behavioral regression.
 */

/**
 * Deterministic (fixed seed, not Math.random -- Math.random would make a
 * parser failure unreproducible) pseudo-random bytes, with CRLF and
 * boundary-like ("--") byte pairs deliberately planted at fixed offsets.
 * Those two sequences are what a multipart parser can actually trip on
 * inside file data; a byte stream that never contains them (e.g. a simple
 * `i % 256` ramp) never exercises that risk regardless of size.
 */
const seededPseudoRandomBytes = (length: number): Buffer => {
  const buffer = Buffer.alloc(length);
  let state = 0x2463a5c3;
  for (let i = 0; i < length; i++) {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    buffer[i] = state & 0xff;
  }
  for (let offset = 1000; offset + 1 < length; offset += 4001) {
    buffer[offset] = 0x0d; // \r
    buffer[offset + 1] = 0x0a; // \n
  }
  for (let offset = 3000; offset + 1 < length; offset += 4001) {
    buffer[offset] = 0x2d; // -
    buffer[offset + 1] = 0x2d; // -
  }
  return buffer;
};

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
    // Comfortably over a typical stream highWaterMark (64KB). Deterministic
    // (fixed seed, not Math.random) but not a simple repeating/monotonic
    // pattern: a multipart parser's actual hazard is a boundary-like byte
    // sequence or a bare CRLF landing inside the file data, which an `i %
    // 256` ramp never produces. seededPseudoRandomBytes deliberately mixes
    // those in.
    fileBytes = seededPseudoRandomBytes(256 * 1024);
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
