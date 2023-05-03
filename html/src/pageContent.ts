type LinkTag = {
  href: string;
};

type ScriptTag = {
  src: string;
};

type HTMLPageContentArgs = {
  meta: {
    title: string;
  };
  stylesheets: LinkTag[];
  scripts: ScriptTag[];
};

const linkTag = ({ href }: LinkTag) => `<link rel="stylesheet" href="${href}">`;

const scriptTag = ({ src }: ScriptTag) =>
  `<script type="module" src="${src}"></script>`;

const metaTags = ({ title }: HTMLPageContentArgs["meta"]) => [
  '<meta charset="UTF-8" />',
  '<meta name="viewport" content="width=device-width" />',
  `<title>${title}</title>`,
];

const headTag = ({
  meta,
  stylesheets,
}: Pick<HTMLPageContentArgs, "meta" | "stylesheets">) => [
  "<head>",
  ...metaTags(meta),
  ...stylesheets.map(linkTag),
  "</head>",
];

const bodyTag = ({ scripts }: Pick<HTMLPageContentArgs, "scripts">) => [
  "<body>",
  ...scripts.map(scriptTag),
  "</body>",
];

const htmlTag = ({ meta, stylesheets, scripts }: HTMLPageContentArgs) => [
  '<html lang="en">',
  ...headTag({ meta, stylesheets }),
  ...bodyTag({ scripts }),
  "</html>",
];

export const htmlPageContent = (args: HTMLPageContentArgs) =>
  ["<!DOCTYPE html>", ...htmlTag(args)].join("\n");
