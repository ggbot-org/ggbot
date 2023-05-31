import { join } from "node:path";

import { htmlPageContent } from "@ggbot2/html";

import { srcPagesDir } from "../package.js";

export const privacyHtmlAppJs = "privacy.js";
export const privacyHtmlFilename = "privacy.html";
export const privacyHtmlEntryPoint = join(srcPagesDir, "privacy.tsx");

export const privacyHtmlPageContent = () =>
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
        src: privacyHtmlAppJs,
      },
    ],
  });
