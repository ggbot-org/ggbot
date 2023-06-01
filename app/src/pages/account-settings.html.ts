import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const accountSettingsHtmlAppJs = "account-settings.js";
export const accountSettingsHtmlFilename = "account-settings.html";
export const accountSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "AccountSettings.tsx"
);

export const accountSettingsHtmlPageContent = () =>
  htmlPageContent({
    hasRootDiv: true,
    meta: {
      title: "ggbot2",
    },
    stylesheets: [
      {
        href: "main.css",
      },
    ],
    scripts: [
      {
        src: accountSettingsHtmlAppJs,
      },
    ],
  });
