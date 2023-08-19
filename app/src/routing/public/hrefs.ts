import { StrategyKey } from "@ggbot2/models"

import {strategyKeyToURLSearchParams} from "../../routing/strategyKeyParams.js"
import {
	privacyHtmlFilename,
	strategyHtmlFilename,
	termsHtmlFilename
} from "./pages.js"

export const href = {
	homePage: () => "/",
	privacyPage: () => `/${privacyHtmlFilename}`,
	termsPage: () => `/${termsHtmlFilename}`,
	strategyPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${strategyHtmlFilename}?${searchParams}`
	},
}
