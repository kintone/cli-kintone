const { isMatchPackage } = require("@cybozu/license-manager");

const config = {
  packageManager: "pnpm",
  analyze: {
    allowLicenses: [
      "MIT",
      "Apache-2.0",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "ISC",
      "0BSD",
      "Python-2.0",
      "MPL-2.0",
      "CC0-1.0",
      "BSD-3-Clause OR MIT",
      "CC-BY-3.0",
      "CC-BY-4.0",
      "(BSD-3-Clause OR GPL-2.0)",
      "(MIT AND Zlib)",
      "(MIT AND BSD-3-Clause)",
      "(MIT AND CC-BY-3.0)",
      "(MIT OR CC0-1.0)",
      "(MIT OR WTFPL)",
      "BlueOak-1.0.0",
      "(BSD-2-Clause OR MIT OR Apache-2.0)",
      "Unlicense",
    ],
    allowPackages: ["map-stream", "pause-stream"],
  },
  extract: {
    output: "./.licenses/NOTICE",
  },
  overrideLicenseText: (dep) => {
    for (const thirdParty of Object.keys(OVERRIDE_LICENSES_TEXT)) {
      if (isMatchPackage(dep, thirdParty)) {
        return OVERRIDE_LICENSES_TEXT[thirdParty];
      }
    }
    return undefined;
  },
};

const OVERRIDE_LICENSES_TEXT = {
  "https-proxy-agent": {
    licensePageUrl:
      "https://raw.githubusercontent.com/TooTallNate/proxy-agents/main/packages/https-proxy-agent/LICENSE",
  },
  "agent-base": {
    licensePageUrl:
      "https://raw.githubusercontent.com/TooTallNate/proxy-agents/main/packages/agent-base/LICENSE",
  },
  through: {
    licensePageUrl:
      "https://raw.githubusercontent.com/dominictarr/through/master/LICENSE.MIT",
  },
};

module.exports = config;
