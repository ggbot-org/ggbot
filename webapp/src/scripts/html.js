import { ENV } from '@workspace/env'

import { reactRootId } from '../react/root.js'

// Use default path for favicon.ico, i.e. put in the root public folder,
// in case some browser does not read the `link rel="icon"` tag.
const faviconIcoUrl = '/favicon.ico'

const logoBaseUrl = '/logo'
const faviconSvgUrl = `${logoBaseUrl}/favicon.svg`
const appleTouchIconUrl = `${logoBaseUrl}/logo-180.png`

/** @param {import('./html').LinkTag} arg */
function linkTag({ href }) {
	return `<link rel="stylesheet" href="${href}">`
}

/** @param {import('./html').ScriptTag} arg */
function scriptTag({ src }) {
	return `<script type="module" src="${src}"></script>`
}

/** @param {string} content */
function styleTag(content) {
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

/** @param {import('./html').MetaTags} arg */
function metaTags({ title, description }) {
	return [
		'<meta charset="UTF-8" />',
		`<title>${title}</title>`,
		`<meta name="description" content="${description}">`,
		'<meta name="viewport" content="width=device-width" />',
		...logoTags
	]
}

/** @param {import('./html').HeadTagArg} arg */
function headTag({ meta, stylesheets }) {
	return [
		'<head>',
		...metaTags(meta),
		styleTag(baseStyle()),
		...stylesheets.map(linkTag),
		'</head>'
	]
}

/** @param {import('./html').Importmap} imports */
function importmap(imports) {
	return [
		'<script type="importmap">',
		JSON.stringify({ imports }),
		'</script>'
	]
}

/** @param {import('./html').BodyTagArg} arg */
function bodyTag({ hasRootDiv, imports, scripts }) {
	return [
		'<body>',
		...importmap(imports),
		hasRootDiv ? `<div id="${reactRootId}"></div>` : '',
		...scripts.map(scriptTag),
		'</body>'
	]
}

/** @param {import('./html').HtmlTagArg} arg */
function htmlTag({ hasRootDiv, imports, meta, stylesheets, scripts }) {
	return [
		'<html lang="en">',
		...headTag({ meta, stylesheets }),
		...bodyTag({ hasRootDiv, imports, scripts }),
		'</html>'
	]
}

/** @type {import('./html').html} */
export function html({ imports, scripts, hasRootDiv = true }) {
	return [
		'<!DOCTYPE html>',
		...htmlTag({
			hasRootDiv,
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
