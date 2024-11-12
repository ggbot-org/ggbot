import { isStrategyKey, Strategy, StrategyFlow, StrategyKey } from '@workspace/models'

import { ActionTypes } from './action.js'

export type PublicAction = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}

export type PublicActionType = keyof PublicAction

export const publicActions: ActionTypes<PublicActionType> = [
	'ReadStrategy',
	'ReadStrategyFlow'
] as const

export type PublicActionInput = {
	ReadStrategy: Parameters<PublicAction['ReadStrategy']>[0]
	ReadStrategyFlow: Parameters<PublicAction['ReadStrategyFlow']>[0]
}

export type PublicActionOutput = {
	ReadStrategy: Awaited<ReturnType<PublicAction['ReadStrategy']>>
	ReadStrategyFlow: Awaited<ReturnType<PublicAction['ReadStrategyFlow']>>
}

export const isPublicActionInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
}
