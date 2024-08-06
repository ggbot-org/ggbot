import { reactRootId } from "_/react/root"
import { ENV } from "@workspace/env"

type LinkTag = { href: string }

type ScriptTag = { src: string }

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

function linkTag({ href }: LinkTag) {
	return `<link rel="stylesheet" href="${href}">`
}

function scriptTag({ src }: ScriptTag) {
	return `<script type="module" src="${src}"></script>`
}

function styleTag(content: string) {
	return `<style>${content}</style>`
}

function baseStyle() {
	return [`html, body, #${reactRootId} { min-height: 100vh; }`].join("\n")
}

const logoTags = [
	`<link rel="icon" href="${faviconIcoUrl}" sizes="any">`,
	`<link rel="apple-touch-icon" sizes="180x180" href="${appleTouchIconUrl}">`,
	`<link rel="icon" href="${faviconSvgUrl}" type="image/svg+xml">`
]

function metaTags({ title }: HeadTagArgs["meta"]) {
	return [
		'<meta charset="UTF-8" />',
		'<meta name="viewport" content="width=device-width" />',
		`<title>${title}</title>`,
		...logoTags
	]
}

function headTag({ meta, stylesheets }: HeadTagArgs) {
	return [
		"<head>",
		...metaTags(meta),
		styleTag(baseStyle()),
		...stylesheets.map(linkTag),
		"</head>"
	]
}

function bodyTag({ hasRootDiv, scripts }: BodyTagArgs) {
	return [
		"<body>",
		hasRootDiv ? `<div id="${reactRootId}"></div>` : "",
		...scripts.map(scriptTag),
		"</body>"
	]
}

function htmlTag({ hasRootDiv, meta, stylesheets, scripts }: HtmlTagArgs) {
	return [
		'<html lang="en">',
		...headTag({ meta, stylesheets }),
		...bodyTag({ hasRootDiv, scripts }),
		"</html>"
	]
}

export function html(scriptJs: string) {
	const title = ENV.PROJECT_SHORT_NAME()
	return [
		"<!DOCTYPE html>",
		...htmlTag({
			hasRootDiv: true,
			meta: { title },
			scripts: [{ src: scriptJs }],
			stylesheets: [{ href: "/main.css" }]
		})
	]
		.filter((tag) => Boolean(tag))
		.join("\n")
}
