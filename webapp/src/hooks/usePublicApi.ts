import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { url } from "_/routing/public/URLs"
import { PublicApiActionType } from "@workspace/api"
import { ReadStrategy, ReadStrategyFlow } from "@workspace/models"

const apiOptions: UseActionApiArg = { endpoint: url.apiPublicAction }

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
