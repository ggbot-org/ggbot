import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { PublicActionInput as Input, PublicActionOutput as Output, PublicActionType as ActionType } from "@workspace/api"

const apiOptions: UseActionApiArg = { url: api.public.action }

export function useReadStrategy() {
	return useAction<ActionType, Input["ReadStrategy"], Output["ReadStrategy"]>(
		apiOptions, "ReadStrategy"
	)
}

export function useReadStrategyFlow() {
	return useAction<ActionType, Input["ReadStrategyFlow"], Output["ReadStrategyFlow"]>(
		apiOptions, "ReadStrategyFlow"
	)
}
