import {
	isStrategyKey,
	Strategy,
	StrategyFlow,
	StrategyKey
} from "@workspace/models"

import { Actions } from "./action.js"

type Action = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}
export type PublicAction = Action
export type PublicActionType = keyof Action
export const publicActions: Actions<PublicActionType> = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const

export type PublicActionInput = {
	ReadStrategy: Parameters<Action["ReadStrategy"]>[0]
	ReadStrategyFlow: Parameters<Action["ReadStrategyFlow"]>[0]
}

export type PublicActionOutput = {
	ReadStrategy: Awaited<ReturnType<Action["ReadStrategy"]>>
	ReadStrategyFlow: Awaited<ReturnType<Action["ReadStrategyFlow"]>>
}

export const isPublicActionInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
}
