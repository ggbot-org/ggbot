import { join } from "node:path"

import { htmlPageContent } from "../html/content.js"
import { generateHtmlPage } from "../html/generate.js"
import { publicDir, webappConfig } from "../package.js"
import { adminHtmlPathnames } from "../routing/admin/pages.js"
import { designShowcaseHtmlPathname } from "../routing/design/pages.js"
import {
	landingHtmlPathnames,
	strategyHtmlPathname
} from "../routing/public/pages.js"
import {
	purchaseCanceledHtmlPathname,
	subscriptionPurchasedHtmlPathname,
	userHtmlPathnames
} from "../routing/user/pages.js"

const jsPath = (path: string[]) => `/${path.join("/")}`

const adminJs = jsPath(webappConfig.admin.jsPath)
const designJs = jsPath(webappConfig.design.jsPath)
const landingJs = jsPath(webappConfig.landing.jsPath)
const strategyJs = jsPath(webappConfig.strategy.jsPath)
const userJs = jsPath(webappConfig.user.jsPath)

const html = (scriptJs: string) =>
	htmlPageContent({
		hasRootDiv: true,
		meta: { title: "ggbot2" },
		scripts: [{ src: scriptJs }],
		stylesheets: [{ href: "/main.css" }]
	})

// Landing pages.

for (const pathname of landingHtmlPathnames)
	await generateHtmlPage(join(publicDir, pathname), html(landingJs))

// Try strategy.

await generateHtmlPage(join(publicDir, strategyHtmlPathname), html(strategyJs))

// Admin app.

for (const pathname of adminHtmlPathnames)
	await generateHtmlPage(join(publicDir, pathname), html(adminJs))

// User app.

for (const pathname of userHtmlPathnames)
	await generateHtmlPage(join(publicDir, pathname), html(userJs))

// Subscription pages.

await generateHtmlPage(
	join(publicDir, purchaseCanceledHtmlPathname),
	html(userJs)
)

await generateHtmlPage(
	join(publicDir, subscriptionPurchasedHtmlPathname),
	html(userJs)
)

// Design.

await generateHtmlPage(
	join(publicDir, designShowcaseHtmlPathname),
	html(designJs)
)
