import { StrategyKey } from "@ggbot2/models"

import { adminDashboardHtmlPathname } from "../admin/routing/pages.js"
import {
	copyStrategyHtmlFilename,
	settingsHtmlFilename,
	strategyHtmlFilename
} from "./pages.js"
import { strategyKeyToURLSearchParams } from "./strategyKeyParams.js"
import { SettingsPageId } from "./types.js"

export const href = {
	adminPage: () => `/${adminDashboardHtmlPathname}`,
	copyStrategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${copyStrategyHtmlFilename}?${searchParams}`
	},
	dashboardPage: () => "/",
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${strategyHtmlFilename}?${searchParams}`
	},
	settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`
}
