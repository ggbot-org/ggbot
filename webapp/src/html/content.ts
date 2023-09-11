// TODO use own assets CDN, now it is https://rsms.me/inter/inter.css
// import { fontBaseUrl, fontFaceUrl } from "@workspace/assets";

type LinkTag = {
	href: string
}

type ScriptTag = {
	src: string
}

type BodyTagArgs = {
	/** Add a `<div id="root"></div>`. */
	hasRootDiv?: boolean
	scripts: ScriptTag[]
}

type HeadTagArgs = {
	/** HTML meta tags. */
	meta: {
		title: string
		// TODO add optional description
		// on landing page is "crypto flow"
	}
	stylesheets: LinkTag[]
}

type HtmlTagArgs = HeadTagArgs & BodyTagArgs

const linkTag = ({ href }: LinkTag) => `<link rel="stylesheet" href="${href}">`

const scriptTag = ({ src }: ScriptTag) =>
	`<script type="module" src="${src}"></script>`

type StyleTag = {
	content: string
}

const styleTag = ({ content }: StyleTag) => `<style>${content}</style>`

const baseStyle = () =>
	[
		// React root element id is "root", it is defined in @ggbo2/react package.
		// Make its height at least the whole page.
		`html, body, #root { min-height: 100vh; }`
	].join("\n")

// TODO use assets CDN
// const fontTags = [
//    `<link rel="preconnect" href="${fontBaseUrl}" crossorigin="">`,
//    `<link href="${fontFaceUrl}" rel="stylesheet">`,
// ];

const metaTags = ({ title }: HeadTagArgs["meta"]) => [
	'<meta charset="UTF-8" />',
	'<meta name="viewport" content="width=device-width" />',
	`<title>${title}</title>`
	// TODO use assets CDN
	//  ...fontTags,
]

const headTag = ({ meta, stylesheets }: HeadTagArgs) => [
	"<head>",
	...metaTags(meta),
	styleTag({ content: baseStyle() }),
	...stylesheets.map(linkTag),
	"</head>"
]

const bodyTag = ({ hasRootDiv, scripts }: BodyTagArgs) => [
	"<body>",
	hasRootDiv ? '<div id="root"></div>' : "",
	...scripts.map(scriptTag),
	"</body>"
]

const htmlTag = ({ hasRootDiv, meta, stylesheets, scripts }: HtmlTagArgs) => [
	'<html lang="en">',
	...headTag({ meta, stylesheets }),
	...bodyTag({ hasRootDiv, scripts }),
	"</html>"
]

export const htmlPageContent = (args: HtmlTagArgs) =>
	["<!DOCTYPE html>", ...htmlTag(args)]
		.filter((tag) => Boolean(tag))
		.join("\n")
