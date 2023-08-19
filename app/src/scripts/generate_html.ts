import { join } from "node:path"

import { generateHtmlPage, htmlPageContent } from "@ggbot2/html"

import {
	adminJs,
	landingJs,
	publicDir,
	strategyJs,
	userJs
} from "../package.js"
import { adminHtmlPathnames } from "../routing/admin/pages.js"
import {
	landingHtmlFilenames,
	strategyHtmlFilename
} from "../routing/public/pages.js"
import {
	purchaseCanceledHtmlFilename,
	subscriptionPurchasedHtmlFilename,
	userHtmlPathnames
} from "../routing/user/pages.js"

const html = (scriptJs: string) =>
	htmlPageContent({
		hasRootDiv: true,
		meta: { title: "ggbot2" },
		scripts: [{ src: scriptJs }],
		stylesheets: [{ href: "/main.css" }]
	})

const generateHtml = async () => {
	// Landing pages.

	for (const filename of landingHtmlFilenames)
		await generateHtmlPage(join(publicDir, filename), html(landingJs))

	// Try strategy.

	await generateHtmlPage(
		join(publicDir, strategyHtmlFilename),
		html(strategyJs)
	)

	// Admin app.

	for (const pathname of adminHtmlPathnames)
		await generateHtmlPage(join(publicDir, pathname), html(adminJs))

	// User app.

	for (const pathname of userHtmlPathnames)
		await generateHtmlPage(join(publicDir, pathname), html(userJs))

	// Subscription

	await generateHtmlPage(
		join(publicDir, purchaseCanceledHtmlFilename),
		html(userJs)
	)

	await generateHtmlPage(
		join(publicDir, subscriptionPurchasedHtmlFilename),
		html(userJs)
	)
}

generateHtml()
