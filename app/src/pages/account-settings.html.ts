import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";
import { SettingsPageId } from "../routing/types.js";
import { settingsHtmlAppJs, settingsHtmlFilename } from "./_settings.js";

const pageId: SettingsPageId = "account";

export const accountSettingsHtmlAppJs = settingsHtmlAppJs(pageId);
export const accountSettingsHtmlFilename = settingsHtmlFilename(pageId);
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
