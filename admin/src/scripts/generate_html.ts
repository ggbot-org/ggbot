import { generateHtmlPage, htmlPageContent } from "@ggbot2/html"

import { indexHtmlAppJs, indexHtmlFilename, publicDir } from "../package.js"

const html = (scriptJs: string) =>
	htmlPageContent({
		hasRootDiv: true,
		meta: { title: "ggbot2" },
		scripts: [{ src: scriptJs }],
		stylesheets: [{ href: "main.css" }]
	})

export const generateHtml = async () => {
	const dirname = publicDir

	await generateHtmlPage({
		dirname,
		filename: indexHtmlFilename,
		htmlContent: html(indexHtmlAppJs)
	})
}

generateHtml()
