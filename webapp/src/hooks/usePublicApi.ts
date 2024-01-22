import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	PublicApiActionType as ActionType,
	ReadStrategy,
	ReadStrategyFlow
} from "@workspace/api"

const apiOptions: UseActionApiArg = { endpoint: api.public.action.href }

export const usePublicApi = {
	ReadStrategy: () =>
		useAction<ReadStrategy, ActionType>(apiOptions, "ReadStrategy"),
	ReadStrategyFlow: () =>
		useAction<ReadStrategyFlow, ActionType>(apiOptions, "ReadStrategyFlow")
}
