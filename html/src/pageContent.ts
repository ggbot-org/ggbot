type LinkTag = {
  href: string;
};

type ScriptTag = {
  src: string;
};

type BodyTagArgs = {
  /** Add a `<div id="root"></div>`. */
  hasRootDiv?: boolean;
  scripts: ScriptTag[];
};

type HeadTagArgs = {
  /** HTML meta tags. */
  meta: {
    title: string;
  };
  stylesheets: LinkTag[];
};

type HtmlTagArgs = HeadTagArgs & BodyTagArgs;

const linkTag = ({ href }: LinkTag) => `<link rel="stylesheet" href="${href}">`;

const scriptTag = ({ src }: ScriptTag) =>
  `<script type="module" src="${src}"></script>`;

const metaTags = ({ title }: HeadTagArgs["meta"]) => [
  '<meta charset="UTF-8" />',
  '<meta name="viewport" content="width=device-width" />',
  `<title>${title}</title>`,
];

const headTag = ({ meta, stylesheets }: HeadTagArgs) => [
  "<head>",
  ...metaTags(meta),
  ...stylesheets.map(linkTag),
  "</head>",
];

const bodyTag = ({ hasRootDiv, scripts }: BodyTagArgs) => [
  "<body>",
  hasRootDiv ? '<div id="root"></div>' : "",
  ...scripts.map(scriptTag),
  "</body>",
];

const htmlTag = ({ hasRootDiv, meta, stylesheets, scripts }: HtmlTagArgs) => [
  '<html lang="en">',
  ...headTag({ meta, stylesheets }),
  ...bodyTag({ hasRootDiv, scripts }),
  "</html>",
];

export const htmlPageContent = (args: HtmlTagArgs) =>
  ["<!DOCTYPE html>", ...htmlTag(args)]
    .filter((tag) => Boolean(tag))
    .join("\n");
