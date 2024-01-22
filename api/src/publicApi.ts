import {
	isStrategyKey,
	Strategy,
	StrategyFlow,
	StrategyKey
} from "@workspace/models"

import { Service } from "./service.js"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]

type Input = {
	ReadStrategy: StrategyKey
	ReadStrategyFlow: StrategyKey
}

type Operation = {
	ReadStrategy: (arg: Input["ReadStrategy"]) => Promise<Strategy | null>
	ReadStrategyFlow: (
		arg: Input["ReadStrategyFlow"]
	) => Promise<StrategyFlow | null>
}

export type PublicApiDataProviderOperation = Operation

export type PublicApiDataProvider = {
	readStrategy: Operation["ReadStrategy"]
	readStrategyFlow: Operation["ReadStrategyFlow"]
}

export type PublicApiService = Service<
	PublicApiActionType,
	PublicApiDataProvider
>

export const isPublicApiInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
} satisfies Record<PublicApiActionType, (arg: unknown) => boolean>
