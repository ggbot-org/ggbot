import { generateHtmlPage, htmlPageContent } from "@ggbot2/html";

import {
  indexHtmlAppJs,
  indexHtmlFilename,
  privacyHtmlAppJs,
  privacyHtmlFilename,
  publicDir,
  termsHtmlAppJs,
  termsHtmlFilename,
} from "../package.js";

const html = (scriptJs: string) =>
  htmlPageContent({
    hasRootDiv: true,
    meta: { title: "ggbot2" },
    stylesheets: [{ href: "main.css" }],
    scripts: [{ src: scriptJs }],
  });

export const generateHtml = async () => {
  const dirname = publicDir;

  await generateHtmlPage({
    dirname,
    filename: indexHtmlFilename,
    htmlContent: html(indexHtmlAppJs),
  });

  await generateHtmlPage({
    dirname,
    filename: privacyHtmlFilename,
    htmlContent: html(privacyHtmlAppJs),
  });

  await generateHtmlPage({
    dirname,
    filename: termsHtmlFilename,
    htmlContent: html(termsHtmlAppJs),
  });
};

generateHtml();
