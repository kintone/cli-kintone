"use strict";

import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import type { Manifest } from "./manifest";
import { format } from "prettier/standalone";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

export const SUPPORT_TEMPLATE_TYPE = ["javascript", "typescript"];
export type TemplateType = "javascript" | "typescript";

export const getTemplateDir = () =>
  path.join(__dirname, "..", "assets", "templates");

export const isValidTemplateType = (templateType: string) => {
  return SUPPORT_TEMPLATE_TYPE.indexOf(templateType) !== -1;
};

/**
 * Return a template type corresponding to the manifest
 * @param manifest
 */
export const getTemplateType = (_manifest: Manifest): TemplateType => {
  // We don't have any other template types
  return "javascript";
};

/**
 * return `true` if `file` is necessary.
 * @param manifest
 * @param file
 */
export const isNecessaryFile = (manifest: Manifest, file: string): boolean => {
  const excludedFiles = ["webpack.entry.json"];
  const isExcludedFile = excludedFiles.some(
    (excludeFile) => path.basename(file) === excludeFile,
  );
  if (isExcludedFile) {
    return false;
  }

  if (/mobile\..+/.test(file)) {
    return !!manifest.mobile;
  }

  if (/config\..+/.test(file)) {
    return !!manifest.config;
  }

  return true;
};

/**
 * Process a template file
 * @param filePath
 * @param srcDir
 * @param destDir
 * @param manifest
 */
export const processTemplateFile = async (
  filePath: string,
  srcDir: string,
  destDir: string,
  manifest: Manifest,
): Promise<void> => {
  const destFilePath = path.join(destDir, path.relative(srcDir, filePath));

  if (path.basename(filePath).endsWith(".tmpl")) {
    const src = fs.readFileSync(filePath, "utf-8");
    const destPath = path.join(
      path.dirname(destFilePath),
      path.basename(destFilePath, ".tmpl"),
    );
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(
      destPath,
      _.template(src)(
        Object.assign({}, manifest, {
          // It's a function to remove whitespaces for package.json's name field
          normalizePackageName: (name: string) => name.replace(/\s/g, "-"),
        }),
      ),
    );
  } else if (path.resolve(filePath) === path.resolve(srcDir, "package.json")) {
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(filePath, "utf-8"),
    );
    packageJson.name = manifest.name.en.replace(/\s/g, "-");
    const sortedPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(destFilePath, sortedPackageJson);
  } else if (
    path.resolve(filePath) ===
    path.resolve(srcDir, "webpack.config.template.js")
  ) {
    const webpackEntryJson: WebpackEntryJson = JSON.parse(
      fs.readFileSync(path.join(srcDir, "webpack.entry.json"), "utf-8"),
    );
    const webpackEntry = manifest.mobile
      ? webpackEntryJson.mobile
      : webpackEntryJson.default;
    const entries: string[] = [];
    for (const [key, value] of Object.entries(webpackEntry)) {
      const entryStr = `${key}: "${value}"`;
      entries.push(entryStr);
    }
    const entriesStr = `{${entries.join(",")}}`;
    let webpackConfigContent: string = fs.readFileSync(filePath, "utf-8");
    webpackConfigContent = webpackConfigContent.replace(
      /'%%placeholder_webpack_entry%%'/,
      entriesStr,
    );
    const prettySource = await format(webpackConfigContent, {
      parser: "typescript",
      plugins: [prettierPluginTypescript, prettierPluginEstree],
    });
    const destPath = path.join(path.dirname(destFilePath), "webpack.config.js");
    fs.writeFileSync(destPath, prettySource);
  } else if (fs.statSync(filePath).isDirectory()) {
    fs.mkdirSync(destFilePath);
  } else {
    // fs.copyFileSync is only available <= v8.5.0
    // fs.copyFileSync(filePath, destFilePath);
    fs.writeFileSync(destFilePath, fs.readFileSync(filePath));
  }
};

type PackageJson = {
  name?: string;
  version?: string;
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

type WebpackEntryJson = {
  default: { [key: string]: string };
  mobile: { [key: string]: string };
};
