import { StrategyKey } from "@ggbot2/models"

import { strategyKeyToURLSearchParams } from "../../routing/strategyKeyParams.js"
import { userDashboardHtmlPathname } from "../user/pages.js"
import {
	privacyHtmlPathname,
	strategyHtmlPathname,
	termsHtmlPathname
} from "./pages.js"

export const href = {
	homePage: () => "/",
	privacyPage: () => privacyHtmlPathname,
	termsPage: () => termsHtmlPathname,
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `${strategyHtmlPathname}?${searchParams}`
	},
	userDashboardPage: () => userDashboardHtmlPathname
}
