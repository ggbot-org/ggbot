import { ReadStrategy, ReadStrategyFlow, Service } from "@workspace/models"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]

export type PublicApiDataProvider = {
	readStrategy: ReadStrategy
	readStrategyFlow: ReadStrategyFlow
}

export type PublicApiService = Service<
	PublicApiActionType,
	PublicApiDataProvider
>
