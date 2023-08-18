import { join } from "node:path"

import { generateHtmlPage, htmlPageContent } from "@ggbot2/html"

import { adminHtmlFilenames } from "../admin/routing/pages.js"
import {
	adminJs,
	appJs,
	publicAdminDir,
	publicDir,
	tryFlowJs
} from "../package.js"
import {
	purchaseCanceledHtmlFilename,
	subscriptionPurchasedHtmlFilename,
	tryFlowHtmlFilename,
	userHtmlFilenames
} from "../routing/pages.js"

const html = (scriptJs: string) =>
	htmlPageContent({
		hasRootDiv: true,
		meta: { title: "ggbot2" },
		scripts: [{ src: scriptJs }],
		stylesheets: [{ href: "/main.css" }]
	})

const generateHtml = async () => {
	// Flow

	await generateHtmlPage(
		join(publicDir, tryFlowHtmlFilename),
		html(tryFlowJs)
	)

	// Admin app.

	for (const filename of adminHtmlFilenames)
		await generateHtmlPage(join(publicAdminDir, filename), html(adminJs))

	// User app.

	for (const filename of userHtmlFilenames)
		await generateHtmlPage(join(publicDir, filename), html(appJs))

	// Subscription

	await generateHtmlPage(
		join(publicDir, purchaseCanceledHtmlFilename),
		html(appJs)
	)

	await generateHtmlPage(
		join(publicDir, subscriptionPurchasedHtmlFilename),
		html(appJs)
	)
}

generateHtml()
