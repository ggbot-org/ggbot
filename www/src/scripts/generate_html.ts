import { join } from "node:path"

import { generateHtmlPage, htmlPageContent } from "@ggbot2/html"

import {
	indexHtmlAppJs,
	indexHtmlFilename,
	privacyHtmlAppJs,
	privacyHtmlFilename,
	publicDir,
	termsHtmlAppJs,
	termsHtmlFilename
} from "../package.js"

const html = (scriptJs: string) =>
	htmlPageContent({
		hasRootDiv: true,
		meta: { title: "ggbot2" },
		scripts: [{ src: scriptJs }],
		stylesheets: [{ href: "main.css" }]
	})

const generateHtml = async () => {
	await generateHtmlPage(
		join(publicDir, indexHtmlFilename),
		html(indexHtmlAppJs)
	)

	await generateHtmlPage(
		join(publicDir, privacyHtmlFilename),
		html(privacyHtmlAppJs)
	)

	await generateHtmlPage(
		join(publicDir, termsHtmlFilename),
		html(termsHtmlAppJs)
	)
}

generateHtml()
