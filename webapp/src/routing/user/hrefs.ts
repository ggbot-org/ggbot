import { StrategyKey } from "@ggbot2/models"

import { adminDashboardHtmlPathname } from "../admin/pages.js"
import { strategyKeyToURLSearchParams } from "../strategyKeyParams.js"
import {
	copyStrategyHtmlPathname,
	settingsHtmlPathname,
	strategyHtmlPathname,
	userDashboardHtmlPathname
} from "./pages.js"
import { SettingsPageId } from "./types.js"

export const href = {
	adminPage: () => adminDashboardHtmlPathname,
	copyStrategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `${copyStrategyHtmlPathname}?${searchParams}`
	},
	dashboardPage: () => userDashboardHtmlPathname,
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `${strategyHtmlPathname}?${searchParams}`
	},
	settingsPage: (id: SettingsPageId) => settingsHtmlPathname(id)
}