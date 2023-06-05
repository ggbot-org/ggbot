import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const manageStrategyHtmlAppJs = "manage-strategy.js";
export const manageStrategyHtmlFilename = "strategy.html";
export const manageStrategyHtmlEntryPoint = join(
  srcPagesDir,
  "ManageStrategy.tsx"
);

export const manageStrategyHtmlPageContent = () =>
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
        src: manageStrategyHtmlAppJs,
      },
    ],
  });
