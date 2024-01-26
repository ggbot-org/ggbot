import {
	Strategy,
	StrategyFlow,
	StrategyKey,
	isStrategyKey
} from "@workspace/models"

type Action = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}
export type PublicDataprovider = Action

type ActionType = keyof Action
export type PublicActionType = ActionType

type Input = {
	ReadStrategy: Parameters<Action['ReadStrategy']>[0]
	ReadStrategyFlow: Parameters<Action['ReadStrategyFlow']>[0]
}
export type PublicActionInput = Input

type Output = {
	ReadStrategy: Awaited<ReturnType<Action['ReadStrategy']>>
	ReadStrategyFlow: Awaited<ReturnType<Action['ReadStrategyFlow']>>
}
export type PublicActionOutput = Output

export const publicActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const satisfies readonly ActionType[]

export const isPublicActionInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
}

