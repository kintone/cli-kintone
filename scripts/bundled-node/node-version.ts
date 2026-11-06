const FULL_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

const PKG_PLATFORMS = ["linux-x64", "macos-arm64", "win-x64"] as const;

export const parseNodeVersion = (content: string): string => {
  const version = content.trim();
  if (!FULL_VERSION_PATTERN.test(version)) {
    throw new Error(
      `.node-version must contain a full Node.js version such as 26.1.0, but got "${version}"`,
    );
  }
  return version;
};

export const buildPkgTargets = (nodeVersion: string): string =>
  PKG_PLATFORMS.map((platform) => `node${nodeVersion}-${platform}`).join(",");
