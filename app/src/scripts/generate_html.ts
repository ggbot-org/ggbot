import { join } from "node:path"

import { generateHtmlPage, htmlPageContent } from "@ggbot2/html"

import {
	adminJs,
	appJs,
	landingJs,
	publicAdminDir,
	publicDir,
	tryFlowJs
} from "../package.js"
import { adminHtmlFilenames } from "../routing/admin/pages.js"
import {
	landingHtmlFilenames,
	tryFlowHtmlFilename
} from "../routing/public/pages.js"
import {
	purchaseCanceledHtmlFilename,
	subscriptionPurchasedHtmlFilename,
	userHtmlFilenames
} from "../routing/user/pages.js"

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

	// Landing pages.

	for (const filename of landingHtmlFilenames)
		await generateHtmlPage(join(publicDir, filename), html(landingJs))

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
