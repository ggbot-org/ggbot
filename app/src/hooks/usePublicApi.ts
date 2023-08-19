import { PublicApiActionType } from "@ggbot2/api"
import { ReadStrategy, ReadStrategyFlow } from "@ggbot2/models"
import { useAction } from "@ggbot2/use-action"

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
