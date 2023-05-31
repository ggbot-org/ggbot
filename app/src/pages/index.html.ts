import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const indexHtmlAppJs = "dashboard.js";
export const indexHtmlFilename = "index.html";
export const indexHtmlEntryPoint = join(srcPagesDir, "Dashboard.tsx");

export const indexHtmlPageContent = () =>
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
        src: indexHtmlAppJs,
      },
    ],
  });
