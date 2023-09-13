import { adminDashboardHtmlPathname } from "_/routing/admin/pages"
import { strategyKeyToURLSearchParams } from "_/routing/strategyKeyParams"
import {
	copyStrategyHtmlPathname,
	settingsHtmlPathname,
	strategyHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"
import { SettingsPageId } from "_/routing/user/types"
import { StrategyKey } from "@workspace/models"

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
