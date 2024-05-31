import { themes as prismThemes } from "prism-react-renderer";
// eslint-disable-next-line node/no-missing-import,node/no-unpublished-import
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "cli-kintone",
  tagline: "The CLI tool to import and export kintone records.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://cli.kintone.dev/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: "kintone", // Usually your GitHub org/user name.
  // projectName: "cli-kintone", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/kintone/cli-kintone/tree/docs/create-doc-site/website",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/kintone/cli-kintone/tree/docs/create-doc-site/website",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "cli-kintone",
      logo: {
        alt: "cli-kintone Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guideSidebar",
          position: "left",
          label: "Guide",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "referenceSidebar",
          position: "left",
          label: "Reference",
        },
        {
          type: "docSidebar",
          sidebarId: "communitySidebar",
          position: "right",
          label: "Community",
        },
        {
          href: "https://github.com/kintone/cli-kintone",
          label: "GitHub",
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
              label: "kintone developer forum (en)",
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
      copyright: `Copyright © ${new Date().getFullYear()} Cybozu, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
