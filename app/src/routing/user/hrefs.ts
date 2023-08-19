import { StrategyKey } from "@ggbot2/models"

import { adminDashboardHtmlPathname } from "../admin/pages.js"
import { strategyKeyToURLSearchParams } from "../strategyKeyParams.js"
import {
	copyStrategyHtmlFilename,
	settingsHtmlFilename,
	strategyHtmlFilename,
	userDashboardHtmlFilename
} from "./pages.js"
import { SettingsPageId } from "./types.js"

export const href = {
	adminPage: () => `/${adminDashboardHtmlPathname}`,
	copyStrategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${copyStrategyHtmlFilename}?${searchParams}`
	},
	dashboardPage: () => `/${userDashboardHtmlFilename}`,
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${strategyHtmlFilename}?${searchParams}`
	},
	settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`
}
