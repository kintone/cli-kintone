import { LocalFSDriver } from "../../../core";
import { logger } from "../../../../utils/log";

export const updatePackageJson = async (opts: {
  packageJsonPath: string;
  packageName: string;
}) => {
  logger.debug(`reading package.json: ${opts.packageJsonPath}`);
  const driver = new LocalFSDriver();
  const manifestJsonStr = await driver.readFile(opts.packageJsonPath, "utf-8");
  const packageJson = JSON.parse(manifestJsonStr);
  packageJson.name = opts.packageName;
  logger.debug(`package name: ${opts.packageName}`);
  await driver.writeFile(
    opts.packageJsonPath,
    JSON.stringify(packageJson, null, 2),
  );
  logger.debug("package.json updated");
};
