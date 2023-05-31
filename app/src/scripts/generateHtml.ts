import { generateHtmlPage } from "@ggbot2/html";

import { publicDir } from "../package.js";
import {
  indexHtmlFilename,
  indexHtmlPageContent,
} from "../pages/index.html.js";

export const generateHtml = async () => {
  const dirname = publicDir;
  const filename = indexHtmlFilename;
  const htmlContent = indexHtmlPageContent();

  await generateHtmlPage({ dirname, filename, htmlContent });
};

generateHtml();
