import {
	Strategy,
	StrategyFlow,
	StrategyKey,
	isStrategyKey
} from "@workspace/models"
import {ActionInputValidators} from "./action"

type Action = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}
export type PublicAction = Action

export type PublicActionType = keyof Action

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

export const isPublicActionInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
} satisfies ActionInputValidators<PublicActionType>

