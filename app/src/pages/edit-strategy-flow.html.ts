import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const editStrategyFlowHtmlAppJs = "edit.js";
export const editStrategyFlowHtmlFilename = "edit.html";
export const editStrategyFlowHtmlEntryPoint = join(
  srcPagesDir,
  "EditStrategyFlow.tsx"
);

export const editStrategyHtmlPageContent = () =>
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
        src: editStrategyFlowHtmlAppJs,
      },
    ],
  });
