import { Given, Then } from "../../utils/world";
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getAssetPath } from "../file";

Then("The file {string} should exist", function (filePath: string) {
  const fullPath = path.join(this.workingDir, filePath);
  assert.ok(fs.existsSync(fullPath), `File does not exist: ${filePath}`);
});

Then("The file {string} should not exist", function (filePath: string) {
  const fullPath = path.join(this.workingDir, filePath);
  assert.ok(!fs.existsSync(fullPath), `File should not exist: ${filePath}`);
});

Then(
  "The customize-manifest at {string} should be a valid template",
  function (filePath: string) {
    const fullPath = path.join(this.workingDir, filePath);
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    assert.ok(content.scope !== undefined, "Missing 'scope' property");
    assert.ok(content.desktop !== undefined, "Missing 'desktop' property");
    assert.ok(content.mobile !== undefined, "Missing 'mobile' property");
    assert.ok(Array.isArray(content.desktop?.js), "desktop.js should be array");
    assert.ok(
      Array.isArray(content.desktop?.css),
      "desktop.css should be array",
    );
    assert.ok(Array.isArray(content.mobile?.js), "mobile.js should be array");
    assert.ok(
      Array.isArray(content.mobile?.css),
      "mobile.css should be array",
    );
  },
);

Then(
  "The customize-manifest at {string} should have desktop js files",
  function (filePath: string) {
    const fullPath = path.join(this.workingDir, filePath);
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    assert.ok(
      content.desktop?.js?.length > 0,
      "Expected desktop.js to have at least one file",
    );
  },
);

Given(
  "I have a customize-manifest.json file at {string}",
  async function (filePath: string) {
    const fullPath = path.join(this.workingDir, filePath);
    const dir = path.dirname(fullPath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(fullPath, "{}");
  },
);

Given(
  "I have a customize-manifest.json file at {string} with content {string}",
  async function (filePath: string, marker: string) {
    const fullPath = path.join(this.workingDir, filePath);
    const dir = path.dirname(fullPath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(fullPath, JSON.stringify({ marker }));
  },
);

Then(
  "The customize-manifest at {string} should have content {string}",
  function (filePath: string, marker: string) {
    const fullPath = path.join(this.workingDir, filePath);
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    assert.strictEqual(content.marker, marker);
  },
);

Given("I have an empty file at {string}", async function (filePath: string) {
  const fullPath = path.join(this.workingDir, filePath);
  const dir = path.dirname(fullPath);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(fullPath, "");
});

Given(
  "The app {string} has customization from asset {string}",
  async function (appKey: string, assetKey: string) {
    const appCredential = this.getAppCredentialByAppKey(appKey);
    const userCredential = this.getUserCredentialByUserKey("kintone_admin");
    const assetPath = getAssetPath(assetKey);
    const manifestPath = path.join(assetPath, "customize-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    const client = new KintoneRestAPIClient({
      baseUrl: process.env.TEST_KINTONE_BASE_URL,
      auth: {
        username: userCredential.username,
        password: userCredential.password,
      },
    });

    const uploadFiles = async (files: string[]) => {
      const result = [];
      for (const filePath of files) {
        const fullPath = path.join(assetPath, filePath);
        const fileContent = fs.readFileSync(fullPath);
        const { fileKey } = await client.file.uploadFile({
          file: { name: path.basename(filePath), data: fileContent },
        });
        result.push({ type: "FILE" as const, file: { fileKey } });
      }
      return result;
    };

    const desktopJs = await uploadFiles(manifest.desktop?.js || []);
    const desktopCss = await uploadFiles(manifest.desktop?.css || []);
    const mobileJs = await uploadFiles(manifest.mobile?.js || []);
    const mobileCss = await uploadFiles(manifest.mobile?.css || []);

    await client.app.updateAppCustomize({
      app: appCredential.appId,
      scope: manifest.scope || "ALL",
      desktop: { js: desktopJs, css: desktopCss },
      mobile: { js: mobileJs, css: mobileCss },
    });

    await client.app.deployApp({ apps: [{ app: appCredential.appId }] });
    await waitForDeploy(client, appCredential.appId);
  },
);

Given("The app {string} has no customization", async function (appKey: string) {
  const appCredential = this.getAppCredentialByAppKey(appKey);
  const userCredential = this.getUserCredentialByUserKey("kintone_admin");

  const client = new KintoneRestAPIClient({
    baseUrl: process.env.TEST_KINTONE_BASE_URL,
    auth: {
      username: userCredential.username,
      password: userCredential.password,
    },
  });

  await client.app.updateAppCustomize({
    app: appCredential.appId,
    scope: "NONE",
    desktop: { js: [], css: [] },
    mobile: { js: [], css: [] },
  });

  await client.app.deployApp({ apps: [{ app: appCredential.appId }] });
  await waitForDeploy(client, appCredential.appId);
});

const waitForDeploy = async (
  client: KintoneRestAPIClient,
  appId: string,
): Promise<void> => {
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    const { apps } = await client.app.getDeployStatus({ apps: [appId] });
    if (apps[0].status === "SUCCESS") {
      return;
    }
    if (apps[0].status === "FAIL") {
      throw new Error(`Deploy failed for app ${appId}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Deploy timeout for app ${appId}`);
};
