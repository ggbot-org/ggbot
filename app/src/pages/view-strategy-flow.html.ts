import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const viewStrategyFlowHtmlAppJs = "view.js";
export const viewStrategyFlowHtmlFilename = "view.html";
export const viewStrategyFlowHtmlEntryPoint = join(
  srcPagesDir,
  "ViewStrategyFlow.tsx"
);

export const viewStrategyHtmlPageContent = () =>
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
        src: viewStrategyFlowHtmlAppJs,
      },
    ],
  });
