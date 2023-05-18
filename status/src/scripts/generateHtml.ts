import { generateHtmlPage } from "@ggbot2/html";
import {
  indexHtmlPageContent,
  indexHtmlFilename,
} from "../pages/index.html.js";
import { publicDir } from "../package.js";

export const generateHtml = async () => {
  const dirname = publicDir;
  const filename = indexHtmlFilename;
  const htmlContent = indexHtmlPageContent();

  await generateHtmlPage({ dirname, filename, htmlContent });
};

await generateHtml();
