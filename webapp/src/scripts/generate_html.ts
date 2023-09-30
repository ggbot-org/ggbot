import { join } from "node:path"

import write from "write-file-utf8"

import { html } from "../html.js"
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

// Landing pages.

for (const pathname of landingHtmlPathnames)
	await write(join(publicDir, pathname), html(landingJs))

// Try strategy.

await write(join(publicDir, strategyHtmlPathname), html(strategyJs))

// Admin app.

for (const pathname of adminHtmlPathnames)
	await write(join(publicDir, pathname), html(adminJs))

// User app.

for (const pathname of userHtmlPathnames)
	await write(join(publicDir, pathname), html(userJs))

// Subscription pages.

await write(join(publicDir, purchaseCanceledHtmlPathname), html(userJs))

await write(join(publicDir, subscriptionPurchasedHtmlPathname), html(userJs))

// Design.

await write(join(publicDir, designShowcaseHtmlPathname), html(designJs))
