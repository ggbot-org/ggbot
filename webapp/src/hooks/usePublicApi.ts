import { useAction } from "_/hooks/useAction.js"
import { url } from "_/routing/public/URLs.js"
import { ReadStrategy, ReadStrategyFlow } from "@ggbot2/models"
import { PublicApiActionType } from "@workspace/api"

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
