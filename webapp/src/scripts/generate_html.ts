import { join } from 'node:path'

import { webappPagePathname, WebappURLs } from '@workspace/locators'
import writeFile from 'write-file-utf8'

import {
	importmapConfig,
	publicDir,
	webappEcmaScriptsConfig,
} from '../package.js'
import { html, HtmlTagArgs } from './html.js'

// Here webapp is used only for pathnames. Any URL is fine as baseURL.
const webapp = new WebappURLs(new URL('http://i.com'))

function webPath(path: string[]) {
	return `/${path.join('/')}`
}

const adminJs = webPath(webappEcmaScriptsConfig.admin.jsPath)
const designJs = webPath(webappEcmaScriptsConfig.design.jsPath)
const landingJs = webPath(webappEcmaScriptsConfig.landing.jsPath)
const strategyJs = webPath(webappEcmaScriptsConfig.strategy.jsPath)
const userJs = webPath(webappEcmaScriptsConfig.user.jsPath)

const imports = Object.fromEntries(
	Object.entries(importmapConfig).map(
		([importName, { targetDir, targetFile }]) => [
			importName,
			webPath([...targetDir, targetFile]),
		]
	)
)

// Landing pages.

for (const pathname of [
	webapp.homepage.pathname,
	webapp.privacy.pathname,
	webapp.terms.pathname,
])
	await writeFile(
		join(publicDir, pathname),
		html({ imports, scripts: [{ src: landingJs }] })
	)

// Shared strategy.

await writeFile(
	join(publicDir, webappPagePathname.strategy),
	html({ imports, scripts: [{ src: strategyJs }] })
)

// Admin app.

for (const pathname of [
	webappPagePathname.admin.dashboard,
	webappPagePathname.admin.accountDetails,
])
	await writeFile(
		join(publicDir, pathname),
		html({ imports, scripts: [{ src: adminJs }] })
	)

// User app.

const userAppScripts = [{ src: userJs }] satisfies HtmlTagArgs['scripts']

for (const pathname of [
	webappPagePathname.user.dashboard,
	webappPagePathname.user.copyStrategy,
	webappPagePathname.user.editStrategy,
	webappPagePathname.user.settings,
	webappPagePathname.user.strategy,
])
	await writeFile(
		join(publicDir, pathname),
		html({ imports, scripts: userAppScripts })
	)

// Subscription pages.

await writeFile(
	join(publicDir, webappPagePathname.purchaseCanceled),
	html({ imports, scripts: userAppScripts })
)

await writeFile(
	join(publicDir, webappPagePathname.subscriptionPurchased),
	html({ imports, scripts: userAppScripts })
)

// Design.

await writeFile(
	join(publicDir, webappPagePathname.design.showcase),
	html({ imports, scripts: [{ src: designJs }] })
)
