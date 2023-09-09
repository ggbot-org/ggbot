import { UtrustCancelURL, UtrustReturnURL } from "@ggbot2/locators"

import { SettingsPageId, settingsPageIds } from "./types.js"

export const userDirname = "user"

export const userDashboardHtmlPathname = `/${userDirname}/dashboard.html`

export const copyStrategyHtmlPathname = `/${userDirname}/copy-strategy.html`

export const strategyHtmlPathname = `/${userDirname}/strategy.html`

export const settingsHtmlPathname = (pageId: SettingsPageId) =>
	`/${userDirname}/${pageId}-settings.html`

export const purchaseCanceledHtmlPathname = `/${UtrustCancelURL.htmlFileName}`

export const subscriptionPurchasedHtmlPathname = `/${UtrustReturnURL.htmlFileName}`

export const userHtmlPathnames = [
	userDashboardHtmlPathname,
	copyStrategyHtmlPathname,
	strategyHtmlPathname,
	...settingsPageIds.map(settingsHtmlPathname)
]
