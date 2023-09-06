import { adminDashboardHtmlPathname } from "_/routing/admin/pages.js"
import { strategyKeyToURLSearchParams } from "_/routing/strategyKeyParams.js"
import {
	copyStrategyHtmlPathname,
	settingsHtmlPathname,
	strategyHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages.js"
import { SettingsPageId } from "_/routing/user/types.js"
import { StrategyKey } from "@ggbot2/models"

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
