import {
	Strategy,
	StrategyFlow,
	StrategyKey,
	isStrategyKey
} from "@workspace/models"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]

type Action = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}

export type PublicApiAction = Action

export type PublicApiInput = {
	ReadStrategy: Parameters<Action["ReadStrategy"]>[0]
	ReadStrategyFlow: Parameters<Action["ReadStrategyFlow"]>[0]
}

export type PublicApiOutput = {
	ReadStrategy: Awaited<ReturnType<Action["ReadStrategy"]>>
	ReadStrategyFlow: Awaited<ReturnType<Action["ReadStrategyFlow"]>>
}

export const isPublicApiInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
}
