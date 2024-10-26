import crypto from "crypto";
import path from "path";
import fs from "fs";
import RSA from "node-rsa";
import yauzl from "yauzl";

import type { PluginZipInterface } from "../index";
import { PluginZip } from "../index";
import { PrivateKey } from "../../crypto";
import { ContentsZip } from "../contents-zip";

const contentsZipPath = path.join(__dirname, "fixtures", "contents.zip");

describe("PluginZip", () => {
  let pluginZip: PluginZip;
  beforeEach(async () => {
    const contentsZip = await ContentsZip.fromBuffer(
      fs.readFileSync(contentsZipPath),
    );
    const key = PrivateKey.generateKey();
    pluginZip = await PluginZip.buildFromContentsZip(contentsZip, key);
  });

  it("the zip contains 3 files", async () => {
    const files = await pluginZip.fileList();
    expect(files.sort()).toStrictEqual(
      ["contents.zip", "PUBKEY", "SIGNATURE"].sort(),
    );
  });

  it("the zip passes signature verification", async () => {
    await verifyPlugin(pluginZip);
  });
});

const streamToBuffer = async (
  stream: NodeJS.ReadableStream,
): Promise<Buffer> => {
  const buffers: Buffer[] = [];
  for await (const data of stream) {
    buffers.push(Buffer.from(data));
  }
  return Buffer.concat(buffers);
};

const readZipContents = (
  zipEntry: yauzl.ZipFile,
): Promise<Map<any, Buffer>> => {
  const zipContentsMap = new Map();
  const streamToBufferPromises: Array<Promise<void>> = [];
  return new Promise((resolve, reject) => {
    zipEntry.on("entry", (entry) => {
      zipEntry.openReadStream(entry, (err, stream) => {
        if (err) {
          reject(err);
        }
        streamToBufferPromises.push(
          streamToBuffer(stream).then((buffer) => {
            zipContentsMap.set(entry.fileName, buffer);
          }),
        );
      });
    });
    zipEntry.on("end", () => {
      Promise.all(streamToBufferPromises).then(() => resolve(zipContentsMap));
    });
  });
};

const verifyPlugin = async (plugin: PluginZipInterface): Promise<void> => {
  const fromBuffer = (buffer: Buffer) =>
    new Promise<yauzl.ZipFile>((resolve, reject) => {
      yauzl.fromBuffer(buffer, (err, zipfile) => {
        if (err) {
          reject(err);
        }
        resolve(zipfile);
      });
    });
  const zipEntry = await fromBuffer(plugin.buffer);
  const zipContentsMap = await readZipContents(zipEntry);
  const contentZip = zipContentsMap.get("contents.zip");
  expect(contentZip).toBeDefined();
  if (contentZip === undefined) {
    throw new Error("contentZip is undefined");
  }
  const verifier = crypto.createVerify("RSA-SHA1");
  verifier.update(contentZip);

  const publicKey = zipContentsMap.get("PUBKEY");
  if (publicKey === undefined) {
    throw new Error("PUBKEY is undefined");
  }
  const signature = zipContentsMap.get("SIGNATURE");
  if (signature === undefined) {
    throw new Error("SIGNATURE is undefined");
  }
  expect(verifier.verify(derToPem(publicKey), signature)).toBe(true);
};

const derToPem = (der: Buffer) => {
  const key = new RSA(der, "pkcs8-public-der");
  return key.exportKey("pkcs1-public-pem");
};
