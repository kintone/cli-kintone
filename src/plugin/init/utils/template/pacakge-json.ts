import { LocalFSDriver } from "../../../core";

export const updatePackageJson = async (opts: {
  packageJsonPath: string;
  packageName: string;
}) => {
  const driver = new LocalFSDriver();
  const manifestJsonStr = await driver.readFile(opts.packageJsonPath, "utf-8");
  const packageJson = JSON.parse(manifestJsonStr);
  packageJson.name = opts.packageName;
  await driver.writeFile(
    opts.packageJsonPath,
    JSON.stringify(packageJson, null, 2),
  );
};
