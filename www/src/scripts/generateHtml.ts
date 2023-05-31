import { generateHtmlPage } from "@ggbot2/html";

import { publicDir } from "../package.js";
import {
  indexHtmlFilename,
  indexHtmlPageContent,
} from "../pages/index.html.js";

export const generateHtml = async () => {
  const dirname = publicDir;

  await generateHtmlPage({
    dirname,
    filename: indexHtmlFilename,
    htmlContent: indexHtmlPageContent(),
  });
};

generateHtml();
