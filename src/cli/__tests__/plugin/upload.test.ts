import { vi } from "vitest";
import { realpathSync } from "fs";
import fs from "fs/promises";
import https from "https";
import os from "os";
import path from "path";
import { generate } from "selfsigned";
import {
  LocalFSDriver,
  ManifestFactory,
  PluginZip,
  PrivateKey,
} from "../../../plugin/core";
import { runCli } from "../cliHelper";

const projectRoot = path.resolve(__dirname, "../../../../");

vi.setConfig({ testTimeout: 30000 });

const pluginWithoutSandboxPath = path.resolve(
  projectRoot,
  "features/assets/plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip",
);
const privateKeyPath = path.resolve(
  projectRoot,
  "src/plugin/core/crypto/__tests__/fixtures/private.ppk",
);
const sandboxManifestPath = path.resolve(
  projectRoot,
  "src/plugin/core/manifest/__tests__/fixtures/plugin-sandbox-valid/manifest.json",
);

const buildPluginWithSandbox = async (outputPath: string) => {
  const privateKey = PrivateKey.importKey(
    await fs.readFile(privateKeyPath, "utf8"),
  );
  const manifest = await ManifestFactory.loadJsonFile(sandboxManifestPath);
  const pluginZip = await PluginZip.build(
    manifest,
    privateKey,
    new LocalFSDriver(path.dirname(sandboxManifestPath)),
  );
  await fs.writeFile(outputPath, pluginZip.buffer);
};

type Certificate = { readonly cert: string; readonly key: string };

// The fake kintone serves HTTPS because the CLI only accepts an HTTPS base URL.
const generateCertificate = (): Certificate => {
  const { cert, private: key } = generate(
    [{ name: "commonName", value: "127.0.0.1" }],
    {
      keySize: 2048,
      algorithm: "sha256",
      extensions: [
        { name: "basicConstraints", cA: true },
        { name: "subjectAltName", altNames: [{ type: 7, ip: "127.0.0.1" }] },
      ],
    },
  );
  return { cert, key };
};

// The CLI reads the connection settings and the proxy from these variables, so they are removed to connect only to the fake kintone.
// The CLI trusts the self-signed certificate of the fake kintone through NODE_EXTRA_CA_CERTS.
const buildEnv = (certPath: string): NodeJS.ProcessEnv => ({
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !/^(KINTONE_|HTTPS?_PROXY$|https?_proxy$)/.test(key),
    ),
  ),
  NODE_EXTRA_CA_CERTS: certPath,
});

type FakeResponse = { status: number; body: unknown };

type FakeKintone = {
  readonly baseUrl: string;
  readonly requests: readonly string[];
  readonly respond: (request: string, response: FakeResponse) => void;
  readonly close: () => Promise<void>;
};

// Stands in for the kintone REST API; each request is recorded as "<method> <path>".
const startFakeKintone = async (
  certificate: Certificate,
): Promise<FakeKintone> => {
  const requests: string[] = [];
  const responses = new Map<string, FakeResponse>();
  const server = https.createServer(certificate, (req, res) => {
    const request = `${req.method} ${new URL(req.url ?? "", "http://localhost").pathname}`;
    requests.push(request);
    req.resume();
    req.on("end", () => {
      const response = responses.get(request) ?? {
        status: 404,
        body: { message: `${request} is not faked` },
      };
      res.writeHead(response.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response.body));
    });
  });
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error(`The fake kintone is not listening on a port: ${address}`);
  }
  return {
    baseUrl: `https://127.0.0.1:${address.port}`,
    requests,
    respond: (request, response) => {
      responses.set(request, response);
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};

const uploadArgs = (inputPath: string, baseUrl: string) => [
  "plugin",
  "upload",
  "--input",
  inputPath,
  "--yes",
  "--base-url",
  baseUrl,
  "--username",
  "user",
  "--password",
  "pass",
];

describe("plugin upload", () => {
  let workDir: string;
  let pluginWithSandboxPath: string;
  let certificate: Certificate;
  let env: NodeJS.ProcessEnv;
  let kintone: FakeKintone;

  beforeAll(async () => {
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-upload-"),
    );
    workDir = realpathSync.native(tempDir);
    pluginWithSandboxPath = path.join(workDir, "sandbox.zip");
    await buildPluginWithSandbox(pluginWithSandboxPath);
    certificate = generateCertificate();
    const certPath = path.join(workDir, "fake-kintone.crt");
    await fs.writeFile(certPath, certificate.cert);
    env = buildEnv(certPath);
  });

  afterAll(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    kintone = await startFakeKintone(certificate);
    kintone.respond("POST /k/v1/file.json", {
      status: 200,
      body: { fileKey: "dummy-file-key" },
    });
    kintone.respond("POST /k/v1/plugin.json", {
      status: 200,
      body: { id: "chjjmgadianhfiopehkbjlfkfioglafk", version: "1" },
    });
    kintone.respond("PUT /k/v1/plugin.json", {
      status: 200,
      body: { id: "chjjmgadianhfiopehkbjlfkfioglafk", version: "1" },
    });
  });

  afterEach(async () => {
    await kintone.close();
  });

  it("should install the plugin that is not installed", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: { plugins: [], totalCount: 0 },
    });

    const result = await runCli(
      uploadArgs(pluginWithoutSandboxPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: [
        "INFO:   Installation Summary:",
        `INFO:     Destination: ${kintone.baseUrl}`,
        `INFO:     File Path: ${pluginWithoutSandboxPath}`,
        "INFO:     Plugin ID: chjjmgadianhfiopehkbjlfkfioglafk",
        "INFO:     Plugin Name: hello-kintone",
        "INFO:     Current version: (not installed)",
        "INFO:     Target version: 1",
        "INFO: Plugin is installed successfully.",
        "",
      ].join("\n"),
    });
    expect(kintone.requests).toStrictEqual([
      "GET /k/v1/plugins.json",
      "POST /k/v1/file.json",
      "POST /k/v1/plugin.json",
    ]);
  });

  it("should update the plugin that is installed", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: {
        plugins: [
          {
            id: "chjjmgadianhfiopehkbjlfkfioglafk",
            name: "hello-kintone",
            isMarketPlugin: false,
            version: "1",
          },
        ],
        totalCount: 1,
      },
    });

    const result = await runCli(
      uploadArgs(pluginWithoutSandboxPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: [
        "INFO:   Installation Summary:",
        `INFO:     Destination: ${kintone.baseUrl}`,
        `INFO:     File Path: ${pluginWithoutSandboxPath}`,
        "INFO:     Plugin ID: chjjmgadianhfiopehkbjlfkfioglafk",
        "INFO:     Plugin Name: hello-kintone",
        "INFO:     Current version: 1",
        "INFO:     Target version: 1",
        "INFO: Plugin is installed successfully.",
        "",
      ].join("\n"),
    });
    expect(kintone.requests).toStrictEqual([
      "GET /k/v1/plugins.json",
      "POST /k/v1/file.json",
      "PUT /k/v1/plugin.json",
    ]);
  });

  it("should print the sandbox settings in the summary", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: { plugins: [], totalCount: 0 },
    });

    const result = await runCli(
      uploadArgs(pluginWithSandboxPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: [
        "INFO:   Installation Summary:",
        `INFO:     Destination: ${kintone.baseUrl}`,
        `INFO:     File Path: ${pluginWithSandboxPath}`,
        "INFO:     Plugin ID: ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj",
        "INFO:     Plugin Name: sandbox sample",
        "INFO:     Current version: (not installed)",
        "INFO:     Target version: 1",
        "INFO:     Sandbox: true",
        "INFO:     Allowed hosts: https://example.com, wss://example.com, https://example.com/api/*, *",
        "INFO:     Permissions: app:read, network:connect, app_record:read:self, file:write",
        "INFO: Plugin is installed successfully.",
        "",
      ].join("\n"),
    });
  });

  // Pins the current behavior, not a designed one: the hidden --guest-space-id reaches the API client, which sends only the file upload to the guest space.
  it("should keep sending only the file upload to the guest space with the hidden --guest-space-id", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: { plugins: [], totalCount: 0 },
    });
    kintone.respond("POST /k/guest/1/v1/file.json", {
      status: 200,
      body: { fileKey: "dummy-file-key" },
    });

    const result = await runCli(
      [
        ...uploadArgs(pluginWithoutSandboxPath, kintone.baseUrl),
        "--guest-space-id",
        "1",
      ],
      workDir,
      env,
    );

    expect(result.exitCode).toBe(0);
    expect(kintone.requests).toStrictEqual([
      "GET /k/v1/plugins.json",
      "POST /k/guest/1/v1/file.json",
      "POST /k/v1/plugin.json",
    ]);
  });

  it("should resolve the plugin file path from the working directory", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: { plugins: [], totalCount: 0 },
    });

    const result = await runCli(
      uploadArgs("sandbox.zip", kintone.baseUrl),
      workDir,
      env,
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain(
      `INFO:     File Path: ${pluginWithSandboxPath}\n`,
    );
  });

  it("should fail when the plugin file does not exist", async () => {
    const inputPath = path.join(workDir, "none.zip");

    const result = await runCli(
      uploadArgs(inputPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Error: Plugin file not found: ${inputPath}\n`,
    });
    expect(kintone.requests).toStrictEqual([]);
  });

  it("should fail when the plugin file is not a zip file", async () => {
    const inputPath = path.join(workDir, "broken.zip");
    await fs.writeFile(inputPath, "not a zip file", "utf8");

    const result = await runCli(
      uploadArgs(inputPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr:
        "ERROR: Error: End of central directory record signature not found. Either not a zip file, or file is truncated.\n",
    });
    expect(kintone.requests).toStrictEqual([]);
  });

  it("should report the missing plugin file before the invalid base URL", async () => {
    const inputPath = path.join(workDir, "none.zip");

    const result = await runCli(
      uploadArgs(inputPath, "http://127.0.0.1"),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Error: Plugin file not found: ${inputPath}\n`,
    });
  });

  it("should report the invalid base URL before the broken plugin file", async () => {
    const inputPath = path.join(workDir, "broken.zip");
    await fs.writeFile(inputPath, "not a zip file", "utf8");

    const result = await runCli(
      uploadArgs(inputPath, "http://127.0.0.1"),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: 'ERROR: Error: The protocol of baseUrl must be "https".\n',
    });
  });

  it("should fail when kintone rejects the upload of the plugin file", async () => {
    kintone.respond("GET /k/v1/plugins.json", {
      status: 200,
      body: { plugins: [], totalCount: 0 },
    });
    kintone.respond("POST /k/v1/file.json", {
      status: 400,
      body: {
        code: "CB_VA01",
        id: "dummy-error-id",
        message: "Invalid request.",
      },
    });

    const result = await runCli(
      uploadArgs(pluginWithoutSandboxPath, kintone.baseUrl),
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: [
        "INFO:   Installation Summary:",
        `INFO:     Destination: ${kintone.baseUrl}`,
        `INFO:     File Path: ${pluginWithoutSandboxPath}`,
        "INFO:     Plugin ID: chjjmgadianhfiopehkbjlfkfioglafk",
        "INFO:     Plugin Name: hello-kintone",
        "INFO:     Current version: (not installed)",
        "INFO:     Target version: 1",
        "ERROR: [400] [CB_VA01] Invalid request. (dummy-error-id)",
        "",
      ].join("\n"),
    });
    expect(kintone.requests).toStrictEqual([
      "GET /k/v1/plugins.json",
      "POST /k/v1/file.json",
    ]);
  });
});
