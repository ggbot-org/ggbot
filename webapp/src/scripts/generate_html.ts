import { join } from 'node:path'

import { webappPagePathname, WebappURLs } from '@workspace/locators'
import writeFile from 'write-file-utf8'

import { publicDir, webappEcmaScriptsConfig } from '../package.js'
import { html } from './html.js'

// Here webapp is used only for pathnames. Any URL is fine as baseURL.
const webapp = new WebappURLs(new URL('http://i.com'))

function jsPath(path: string[]) {
	return `/${path.join('/')}`
}

const adminJs = jsPath(webappEcmaScriptsConfig.admin.jsPath)
const designJs = jsPath(webappEcmaScriptsConfig.design.jsPath)
const landingJs = jsPath(webappEcmaScriptsConfig.landing.jsPath)
const strategyJs = jsPath(webappEcmaScriptsConfig.strategy.jsPath)
const userJs = jsPath(webappEcmaScriptsConfig.user.jsPath)

// Landing pages.

for (const pathname of [
	webapp.homepage.pathname,
	webapp.privacy.pathname,
	webapp.terms.pathname,
]) await writeFile(join(publicDir, pathname), html(landingJs))

// Shared strategy.

await writeFile(join(publicDir, webappPagePathname.strategy), html(strategyJs))

// Admin app.

for (const pathname of [
	webappPagePathname.admin.dashboard,
	webappPagePathname.admin.accountDetails,
]) await writeFile(join(publicDir, pathname), html(adminJs))

// User app.

for (const pathname of [
	webappPagePathname.user.dashboard,
	webappPagePathname.user.copyStrategy,
	webappPagePathname.user.editStrategy,
	webappPagePathname.user.settings,
	webappPagePathname.user.strategy,
]) await writeFile(join(publicDir, pathname), html(userJs))

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

await writeFile(join(publicDir, webappPagePathname.design.showcase), html(designJs))
