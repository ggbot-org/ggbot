import { useAction } from "_/hooks/useAction.js"
import { url } from "_/routing/public/URLs.js"
import { PublicApiActionType } from "@workspace/api"
import { ReadStrategy, ReadStrategyFlow } from "@workspace/models"

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
