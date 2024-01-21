import { Strategy, StrategyFlow, StrategyKey } from "@workspace/models"

import { Service } from "./service.js"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]

export type ReadStrategy = (arg: StrategyKey) => Promise<Strategy | null>

export type ReadStrategyFlow = (
	arg: StrategyKey
) => Promise<StrategyFlow | null>

export type PublicApiDataProvider = {
	readStrategy: ReadStrategy
	readStrategyFlow: ReadStrategyFlow
}

export type PublicApiService = Service<
	PublicApiActionType,
	PublicApiDataProvider
>
