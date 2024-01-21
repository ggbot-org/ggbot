import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	PublicApiActionType,
	ReadStrategy,
	ReadStrategyFlow
} from "@workspace/api"

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
