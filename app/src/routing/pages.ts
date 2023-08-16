import { UtrustCancelURL, UtrustReturnURL } from "@ggbot2/locators"

import { SettingsPageId } from "./types.js"

export const indexHtmlFilename = "index.html"

export const adminDashboardHtmlFilename = "admin.html"

export const copyStrategyHtmlFilename = "copy-strategy.html"

export const tryFlowHtmlFilename = "flow.html"

export const strategyHtmlFilename = "strategy.html"

export const settingsHtmlFilename = (id: SettingsPageId) =>
	`${id}-settings.html`

export const purchaseCanceledHtmlFilename = UtrustCancelURL.htmlFileName

export const subscriptionPurchasedHtmlFilename = UtrustReturnURL.htmlFileName
