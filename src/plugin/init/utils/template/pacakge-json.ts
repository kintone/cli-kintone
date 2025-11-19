import { LocalFSDriver } from "../../../core";
import { logger } from "../../../../utils/log";

export type PackageJsonPatch = {
  name: string;
};

export const updatePackageJson = async (opts: {
  packageJsonPath: string;
  patch: PackageJsonPatch;
}) => {
  logger.debug(`reading package.json: ${opts.packageJsonPath}`);
  const driver = new LocalFSDriver();
  const manifestJsonStr = await driver.readFile(opts.packageJsonPath, "utf-8");
  const packageJson = JSON.parse(manifestJsonStr);
  packageJson.name = opts.patch.name;
  logger.debug(`package name: ${opts.patch.name}`);
  await driver.writeFile(
    opts.packageJsonPath,
    JSON.stringify(packageJson, null, 2),
  );
  logger.debug("package.json updated");
};
