import {
	WebappSettingsPageId,
	webappSettingsPageIds
} from "@workspace/locators"

import { userDirname } from "../../dirnames"

export const userDashboardHtmlPathname = `/${userDirname}/dashboard.html`

export const copyStrategyHtmlPathname = `/${userDirname}/copy-strategy.html`

export const strategyHtmlPathname = `/${userDirname}/strategy.html`

export const settingsHtmlPathname = (pageId: WebappSettingsPageId) =>
	`/${userDirname}/${pageId}-settings.html`

export const userHtmlPathnames = [
	userDashboardHtmlPathname,
	copyStrategyHtmlPathname,
	strategyHtmlPathname,
	...webappSettingsPageIds.map(settingsHtmlPathname)
]
