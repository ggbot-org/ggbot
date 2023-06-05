import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const copyStrategyHtmlAppJs = "copy-strategy.js";
export const copyStrategyHtmlFilename = "copy-strategy.html";
export const copyStrategyHtmlEntryPoint = join(srcPagesDir, "CopyStrategy.tsx");

export const copyStrategyHtmlPageContent = () =>
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
        src: copyStrategyHtmlAppJs,
      },
    ],
  });
