import { reactRootId } from "../react/root.js"

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

// Use default path for favicon.ico, i.e. put in the root public folder,
// in case some browser does not read the `link rel="icon"` tag.
const faviconIcoUrl = "/favicon.ico"

const logoBaseUrl = "/logo"
const faviconSvgUrl = `${logoBaseUrl}/favicon.svg`
const appleTouchIconUrl = `${logoBaseUrl}/logo-180.png`

const fontBaseUrl = "https://rsms.me"
const fontFaceUrl = `${fontBaseUrl}/inter/inter.css`

const linkTag = ({ href }: LinkTag) => `<link rel="stylesheet" href="${href}">`

const scriptTag = ({ src }: ScriptTag) =>
	`<script type="module" src="${src}"></script>`

type StyleTag = {
	content: string
}

const styleTag = ({ content }: StyleTag) => `<style>${content}</style>`

const baseStyle = () =>
	[`html, body, #${reactRootId} { min-height: 100vh; }`].join("\n")

const logoTags = [
	`<link rel="icon" href="${faviconIcoUrl}" sizes="any">`,
	`<link rel="apple-touch-icon" sizes="180x180" href="${appleTouchIconUrl}">`,
	`<link rel="icon" href="${faviconSvgUrl}" type="image/svg+xml">`
]

const fontTags = [
	`<link rel="preconnect" href="${fontBaseUrl}" crossorigin="">`,
	`<link href="${fontFaceUrl}" rel="stylesheet">`
]

const metaTags = ({ title }: HeadTagArgs["meta"]) => [
	'<meta charset="UTF-8" />',
	'<meta name="viewport" content="width=device-width" />',
	`<title>${title}</title>`,
	...logoTags,
	...fontTags
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
	hasRootDiv ? `<div id="${reactRootId}"></div>` : "",
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
