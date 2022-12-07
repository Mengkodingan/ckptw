// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ckptw",
  tagline: "easy way to create an Whatsapp Bot.",
  url: "https://ckptw.mengkodingan.my.id",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "mengkodingan", // Usually your GitHub org/user name.
  projectName: "ckptw", // Usually your repo name.
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          lastVersion: "current",
          versions: {
            current: {
              label: "1.0.2",
            },
          },
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/mengkodingan/ckptw/blob/docs/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "@mengkodingan/ckptw",
        items: [
          {
            type: "docsVersionDropdown",
            position: "right",
            dropdownActiveClassDisabled: true,
          },
          {
            type: "doc",
            docId: "welcome/index",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://npmjs.com/package/@mengkodingan/ckptw",
            position: "right",
            className: "header-npm-link",
            "aria-label": "npm",
          },
          {
            href: "https://github.com/mengkodingan/ckptw",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} <b>Mengkodingan</b>. Built with Docusaurus.`,
      },
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],
};

module.exports = config;
