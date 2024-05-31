const { isMatchName } = require("@cybozu/license-manager");

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
      "CC-BY-3.0",
      "CC-BY-4.0",
      "(MIT OR CC0-1.0)",
      "(MIT OR WTFPL)",
      "(WTFPL OR MIT)",
      "BlueOak-1.0.0",
      "(BSD-2-Clause OR MIT OR Apache-2.0)",
      "Unlicense",
    ],
    allowPackages: ["map-stream", "pause-stream", "node-forge"],
  },
  extract: {
    output: "./NOTICE",
  },
  overrideLicense: (dep) => {
    // https://github.com/felixge/node-require-like/blob/master/License
    if (dep.name === "require-like") {
      return "MIT";
    }
  },
  overrideLicenseText: (dep) => {
    for (const packageName of Object.keys(OVERRIDE_LICENSES_TEXT)) {
      if (isMatchName(dep, packageName)) {
        return OVERRIDE_LICENSES_TEXT[packageName];
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
