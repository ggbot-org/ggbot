import { UtrustCancelURL, UtrustReturnURL } from "@ggbot2/locators"

import { SettingsPageId, settingsPageIds } from "./types.js"

export const userDirname = "user"

export const userDashboardHtmlFilename = "index.html"
export const userDashboardHtmlPathname = `${userDirname}/${userDashboardHtmlFilename}`

export const copyStrategyHtmlFilename = "copy-strategy.html"
export const copyStrategyHtmlPathname = `${userDirname}/${copyStrategyHtmlFilename}`

export const strategyHtmlFilename = "strategy.html"
export const strategyHtmlPathname = `${userDirname}/${strategyHtmlFilename}`

export const settingsHtmlFilename = (pageId: SettingsPageId) =>
	`${pageId}-settings.html`
export const settingsHtmlPathname = (pageId: SettingsPageId) =>
	`${userDirname}/${settingsHtmlFilename(pageId)}`

export const purchaseCanceledHtmlFilename = UtrustCancelURL.htmlFileName

export const subscriptionPurchasedHtmlFilename = UtrustReturnURL.htmlFileName

export const userHtmlFilenames = [
	userDashboardHtmlFilename,
	copyStrategyHtmlFilename,
	strategyHtmlFilename,
	...settingsPageIds.map(settingsHtmlFilename)
]
