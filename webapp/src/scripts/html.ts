import { ENV } from '@workspace/env'

import { reactRootId } from '../react/root.js'

type LinkTag = { href: string }

type ScriptTag = { src: string }

type BodyTagArgs = {
	/** Add a `<div id="root"></div>`. */
	hasRootDiv?: boolean
	scripts: ScriptTag[]
	/** Object for importmap script. */
	imports: Record<string, string>
}

type HeadTagArgs = {
	/** HTML meta tags. */
	meta: {
		description: string
		title: string
	}
	stylesheets: LinkTag[]
}

export type HtmlTagArgs = HeadTagArgs & BodyTagArgs

// Use default path for favicon.ico, i.e. put in the root public folder,
// in case some browser does not read the `link rel="icon"` tag.
const faviconIcoUrl = '/favicon.ico'

const logoBaseUrl = '/logo'
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
	return [`html, body, #${reactRootId} { min-height: 100vh; }`].join('\n')
}

const logoTags = [
	`<link rel="icon" href="${faviconIcoUrl}" sizes="any">`,
	`<link rel="apple-touch-icon" sizes="180x180" href="${appleTouchIconUrl}">`,
	`<link rel="icon" href="${faviconSvgUrl}" type="image/svg+xml">`
]

function metaTags({ title, description }: HeadTagArgs['meta']) {
	return [
		'<meta charset="UTF-8" />',
		`<title>${title}</title>`,
		`<meta name="description" content="${description}">`,
		'<meta name="viewport" content="width=device-width" />',
		...logoTags
	]
}

function headTag({ meta, stylesheets }: HeadTagArgs) {
	return [
		'<head>',
		...metaTags(meta),
		styleTag(baseStyle()),
		...stylesheets.map(linkTag),
		'</head>'
	]
}

function importmap(imports: BodyTagArgs['imports']) {
	return [
		'<script type="importmap">',
		JSON.stringify({ imports }),
		'</script>'
	]
}

function bodyTag({ hasRootDiv, imports, scripts }: BodyTagArgs) {
	return [
		'<body>',
		...importmap(imports),
		hasRootDiv ? `<div id="${reactRootId}"></div>` : '',
		...scripts.map(scriptTag),
		'</body>'
	]
}

function htmlTag({ hasRootDiv, imports, meta, stylesheets, scripts }: HtmlTagArgs) {
	return [
		'<html lang="en">',
		...headTag({ meta, stylesheets }),
		...bodyTag({ hasRootDiv, imports, scripts }),
		'</html>'
	]
}

export function html({ imports, scripts }: Pick<BodyTagArgs, 'imports' | 'scripts'>) {
	return [
		'<!DOCTYPE html>',
		...htmlTag({
			hasRootDiv: true,
			meta: {
				description: ENV.PROJECT_TAG_LINE(),
				// TODO should be PROJECT_BRAND_NAME instead
				title: ENV.PROJECT_SHORT_NAME(),
			},
			imports,
			scripts,
			stylesheets: [{ href: '/main.css' }]
		})
	]
		.filter((tag) => Boolean(tag))
		.join('\n')
}
