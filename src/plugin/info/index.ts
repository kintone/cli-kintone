import fs from "fs/promises";
import { PluginZip } from "../packer/plugin-zip";

export type OutputFormat = "plain" | "json";

export const run = async (pluginFilePath: string, format: OutputFormat) => {
  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const id = await pluginZip.getPluginID();
  const manifest = await pluginZip.manifest();

  const info = {
    id: id,
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    homepage: manifest.homepageUrl,
  };

  switch (format) {
    case "plain":
      console.log("id:", info.id);
      console.log("name:", info.name);
      console.log("version:", info.version);
      console.log("description:", info.description ?? "(not set)");
      console.log("homepage:", info.homepage ?? "(not set)");
      break;
    case "json":
      console.log(JSON.stringify(info, null, 2));
  }
};
