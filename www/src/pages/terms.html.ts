import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const termsHtmlAppJs = "terms.js";
export const termsHtmlFilename = "terms.html";
export const termsHtmlEntryPoint = join(srcPagesDir, "terms.tsx");

export const termsHtmlPageContent = () =>
  htmlPageContent({
    hasRootDiv: true,
    meta: {
      title: "ggbot2 status page",
    },
    stylesheets: [
      {
        href: "main.css",
      },
    ],
    scripts: [
      {
        src: termsHtmlAppJs,
      },
    ],
  });
