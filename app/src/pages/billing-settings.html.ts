import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";
import { SettingsPageId } from "../routing/types.js";
import { settingsHtmlAppJs, settingsHtmlFilename } from "./_settings.js";

const pageId: SettingsPageId = "billing";

export const billingSettingsHtmlAppJs = settingsHtmlAppJs(pageId);
export const billingSettingsHtmlFilename = settingsHtmlFilename(pageId);
export const billingSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "BillingSettings.tsx"
);

export const billingSettingsHtmlPageContent = () =>
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
        src: billingSettingsHtmlAppJs,
      },
    ],
  });
