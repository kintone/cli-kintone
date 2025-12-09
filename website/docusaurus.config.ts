import { themes as prismThemes } from "prism-react-renderer";
// eslint-disable-next-line n/no-missing-import
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "cli-kintone",
  tagline: "The CLI tool for importing and exporting Kintone records.",
  favicon: "img/cli-kintone_logo.svg",

  // Set the production url of your site here
  url: "https://cli.kintone.dev/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: "kintone", // Usually your GitHub org/user name.
  // projectName: "cli-kintone", // Usually your repo name.

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    localeConfigs: {
      en: {
        label: "English",
      },
      ja: {
        label: "日本語",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/kintone/cli-kintone/tree/main/website",
          // showLastUpdateTime: true,
          // showLastUpdateAuthor: true,
          admonitions: {
            keywords: ["experimental", "deprecated"],
            extendDefaults: true,
          },
        },
        blog: {
          showReadingTime: true,
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/kintone/cli-kintone/tree/main/website",
        },
        theme: {
          customCss: "./src/css/custom.scss",
        },
        googleTagManager: {
          containerId: "GTM-5N49D3",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/cli-kintone_social.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "cli-kintone",
      logo: {
        alt: "cli-kintone Logo",
        src: "img/cli-kintone_logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guideSidebar",
          position: "left",
          label: "Guide",
        },
        {
          type: "docSidebar",
          sidebarId: "referenceSidebar",
          position: "left",
          label: "Reference",
        },
        {
          type: "docSidebar",
          sidebarId: "communitySidebar",
          position: "left",
          label: "Community",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/kintone/cli-kintone",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "User Guide",
              to: "/guide",
            },
            {
              label: "Reference",
              to: "/reference",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "cybozu developer network",
              href: "https://cybozu.dev/ja/",
            },
            {
              label: "cybozu developer community (ja)",
              href: "https://community.cybozu.dev/c/best-practices/8",
            },
            {
              label: "Kintone Developer Forum (en)",
              href: "https://forum.kintone.dev/",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/kintonedevjp",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/kintone/cli-kintone",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cybozu, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "powershell", "csv"],
    },
    algolia: {
      appId: "JRU2EW1Y0Z",
      apiKey: "1f783c5faa4d2cca91a435ae227cc48f",
      indexName: "cli",
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
  plugins: ["docusaurus-plugin-sass"],
};

export default config;
