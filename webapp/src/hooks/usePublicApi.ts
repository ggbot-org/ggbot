import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	PublicAction as Action,
	PublicActionType as ActionType
} from "@workspace/api"

const apiOptions: UseActionApiArg = { endpoint: api.public.action.href }

export const usePublicApi = {
	ReadStrategy: () =>
		useAction<Action["ReadStrategy"], ActionType>(
			apiOptions,
			"ReadStrategy"
		),
	ReadStrategyFlow: () =>
		useAction<Action["ReadStrategyFlow"], ActionType>(
			apiOptions,
			"ReadStrategyFlow"
		)
}
