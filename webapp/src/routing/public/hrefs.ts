import { StrategyKey } from "@workspace/models"

import { strategyKeyToURLSearchParams } from "../../routing/strategyKeyParams"
import { userDashboardHtmlPathname } from "../user/pages"

// TODO actually this is a pathname, not an href
// anyway, remove this file and use routing/webapp directly
export const href = {
	homePage: () => "/",
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `strategy.html?${searchParams}`
	},
	userDashboardPage: () => userDashboardHtmlPathname
}
