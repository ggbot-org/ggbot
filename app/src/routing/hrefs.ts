import { StrategyKey } from "@ggbot2/models"

import { adminDashboardHtmlPathname } from "../admin/routing/pages.js"
import {
	copyStrategyHtmlFilename,
	settingsHtmlFilename,
	strategyHtmlFilename,
	tryFlowHtmlFilename
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
	tryFlowPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${tryFlowHtmlFilename}?${searchParams}`
	},
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${strategyHtmlFilename}?${searchParams}`
	},
	settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`
}
