import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";
import { SettingsPageId } from "../routing/types.js";
import { settingsHtmlAppJs, settingsHtmlFilename } from "./_settings.js";

const pageId: SettingsPageId = "binance";

export const binanceSettingsHtmlAppJs = settingsHtmlAppJs(pageId);
export const binanceSettingsHtmlFilename = settingsHtmlFilename(pageId);
export const binanceSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "BinanceSettings.tsx"
);

export const binanceSettingsHtmlPageContent = () =>
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
        src: binanceSettingsHtmlAppJs,
      },
    ],
  });
