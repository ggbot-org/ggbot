import { StrategyKey } from "@ggbot2/models"

import {strategyKeyToURLSearchParams} from "../../routing/strategyKeyParams.js"
import {
	tryFlowHtmlFilename
} from "./pages.js"

export const href = {
	homePage: () => "/",
	tryFlowPage: (strategyKey: StrategyKey) => {
		const searchParams =
			strategyKeyToURLSearchParams(strategyKey).toString()
		return `/${tryFlowHtmlFilename}?${searchParams}`
	},
}
