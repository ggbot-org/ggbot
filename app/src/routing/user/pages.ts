import { UtrustCancelURL, UtrustReturnURL } from "@ggbot2/locators"

import { SettingsPageId, settingsPageIds } from "./types.js"

export const dashboardHtmlFilename = "index.html"

export const copyStrategyHtmlFilename = "copy-strategy.html"

export const strategyHtmlFilename = "strategy.html"

export const settingsHtmlFilename = (id: SettingsPageId) =>
	`${id}-settings.html`

export const purchaseCanceledHtmlFilename = UtrustCancelURL.htmlFileName

export const subscriptionPurchasedHtmlFilename = UtrustReturnURL.htmlFileName

export const userHtmlFilenames = [
	dashboardHtmlFilename,
	copyStrategyHtmlFilename,
	strategyHtmlFilename,
	...settingsPageIds.map(settingsHtmlFilename)
]
