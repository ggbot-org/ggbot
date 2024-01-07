import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { PublicApiActionType } from "@workspace/api"
import { ReadStrategy, ReadStrategyFlow } from "@workspace/models"

const apiOptions: UseActionApiArg = { endpoint: api.public.action.href }

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
