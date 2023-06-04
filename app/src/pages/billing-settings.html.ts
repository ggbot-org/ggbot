import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";
import { SettingsSectionId } from "../routing/types.js";
import { settingsHtmlAppJs, settingsHtmlFilename } from "./_settings.js";

const sectionId: SettingsSectionId = "billing";

export const billingSettingsHtmlAppJs = settingsHtmlAppJs(sectionId);
export const billingSettingsHtmlFilename = settingsHtmlFilename(sectionId);
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
