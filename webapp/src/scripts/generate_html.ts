import { join } from "node:path"

import { ENV } from "@workspace/env"
import {
	WebappPagePathname,
	webappSettingsPageIds,
	WebappURLs
} from "@workspace/locators"
import write from "write-file-utf8"

import { html } from "../html.js"
import { publicDir, webappEcmaScriptsConfig } from "../package.js"
import { adminHtmlPathnames } from "../routing/admin/pages.js"
import { designShowcaseHtmlPathname } from "../routing/design/pages.js"
import { settingsHtmlPathname } from "../routing/user/pages.js"

const webapp = new WebappURLs(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())

const jsPath = (path: string[]) => `/${path.join("/")}`

const adminJs = jsPath(webappEcmaScriptsConfig.admin.jsPath)
const designJs = jsPath(webappEcmaScriptsConfig.design.jsPath)
const landingJs = jsPath(webappEcmaScriptsConfig.landing.jsPath)
const strategyJs = jsPath(webappEcmaScriptsConfig.strategy.jsPath)
const userJs = jsPath(webappEcmaScriptsConfig.user.jsPath)

// Landing pages.

for (const pathname of [
	webapp.homepage.pathname,
	webapp.privacy.pathname,
	webapp.terms.pathname
])
	await write(join(publicDir, pathname), html(landingJs))

// Try strategy.

await write(join(publicDir, WebappPagePathname.strategy), html(strategyJs))

// Admin app.

for (const pathname of adminHtmlPathnames)
	await write(join(publicDir, pathname), html(adminJs))

// User app.

const userHtmlPathnames = [
	WebappPagePathname.user.dashboard,
	WebappPagePathname.user.copyStrategy,
	WebappPagePathname.user.strategy,
	...webappSettingsPageIds.map(settingsHtmlPathname)
]

for (const pathname of userHtmlPathnames)
	await write(join(publicDir, pathname), html(userJs))

// Subscription pages.

await write(join(publicDir, WebappPagePathname.purchaseCanceled), html(userJs))

await write(
	join(publicDir, WebappPagePathname.subscriptionPurchased),
	html(userJs)
)

// Design.

await write(join(publicDir, designShowcaseHtmlPathname), html(designJs))
