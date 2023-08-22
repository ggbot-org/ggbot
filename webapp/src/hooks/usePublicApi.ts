import { ReadStrategy, ReadStrategyFlow } from "@ggbot2/models"
import { PublicApiActionType } from "@workspace/api"

import { useAction } from "../hooks/useAction.js"
import { url } from "../routing/public/URLs.js"

const apiOptions = { endpoint: url.apiPublicAction }

export const usePublicApi = {
	ReadStrategy: () =>
		useAction<ReadStrategy, PublicApiActionType>(
			apiOptions,
			"ReadStrategy"
		),
	ReadStrategyFlow: () =>
		useAction<ReadStrategyFlow, PublicApiActionType>(
			apiOptions,
			"ReadStrategyFlow"
		)
}
