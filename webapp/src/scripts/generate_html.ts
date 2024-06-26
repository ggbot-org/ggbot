import { join } from "node:path"

import { adminHtmlPathnames } from "_/routing/admin/pages.js"
import { designShowcaseHtmlPathname } from "_/routing/design/pages.js"
import { ENV } from "@workspace/env"
import { webappPagePathname, WebappURLs } from "@workspace/locators"
import writeFile from "write-file-utf8"

import { publicDir, webappEcmaScriptsConfig } from "../package.js"
import { html } from "./html.js"

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
	await writeFile(join(publicDir, pathname), html(landingJs))

// Try strategy.

await writeFile(join(publicDir, webappPagePathname.strategy), html(strategyJs))

// Admin app.

for (const pathname of adminHtmlPathnames)
	await writeFile(join(publicDir, pathname), html(adminJs))

// User app.

const userHtmlPathnames = [
	webappPagePathname.user.dashboard,
	webappPagePathname.user.copyStrategy,
	webappPagePathname.user.editStrategy,
	webappPagePathname.user.settings,
	webappPagePathname.user.strategy
]

for (const pathname of userHtmlPathnames)
	await writeFile(join(publicDir, pathname), html(userJs))

// Subscription pages.

await writeFile(
	join(publicDir, webappPagePathname.purchaseCanceled),
	html(userJs)
)

await writeFile(
	join(publicDir, webappPagePathname.subscriptionPurchased),
	html(userJs)
)

// Design.

await writeFile(join(publicDir, designShowcaseHtmlPathname), html(designJs))
