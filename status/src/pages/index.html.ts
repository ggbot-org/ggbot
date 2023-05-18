import { htmlPageContent } from "@ggbot2/html";
import { filename } from "@ggbot2/repo";

// TODO this could be a common class WebappHtmlPage
export const indexHtmlAppJs = filename.appJs;
export const indexHtmlFilename = filename.indexHtml;
export const indexHtmlStyleCss = filename.styleCss;
export const indexHtmlTitle = "";

export const indexHtmlPageContent = () =>
  htmlPageContent({
    meta: {
      title: "ggbot2 status page",
    },
    stylesheets: [
      {
        href: indexHtmlStyleCss,
      },
    ],
    scripts: [
      {
        src: indexHtmlAppJs,
      },
    ],
  });
