import { StrategyKey } from "@workspace/models"

import { strategyKeyToURLSearchParams } from "../../routing/strategyKeyParams"
import { userDashboardHtmlPathname } from "../user/pages"
import {
	privacyHtmlPathname,
	strategyHtmlPathname,
	termsHtmlPathname
} from "./pages"

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
