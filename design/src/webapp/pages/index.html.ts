import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../../package.js";

export const indexHtmlAppJs = "app.js";
export const indexHtmlFilename = "index.html";
export const indexHtmlEntryPoint = join(srcPagesDir, "homepage.tsx");

export const indexHtmlPageContent = () =>
  htmlPageContent({
    hasRootDiv: true,
    meta: {
      title: "ggbot2 design",
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
