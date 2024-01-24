import {
	isStrategyKey,
	Service,
	Strategy,
	StrategyFlow,
	StrategyKey
} from "@workspace/models"

export const publicApiOperationNames = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
type PublicApiOperationName = (typeof publicApiOperationNames)[number]

type Operation = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: (arg: StrategyKey) => Promise<StrategyFlow | null>
}

type Input = {
	ReadStrategy: Parameters<Operation["ReadStrategy"]>[0]
	ReadStrategyFlow: Parameters<Operation["ReadStrategyFlow"]>[0]
}

export type PublicApiInput = Input

export type PublicApiOutput = {
	ReadStrategy: Awaited<ReturnType<Operation["ReadStrategy"]>>
	ReadStrategyFlow: Awaited<ReturnType<Operation["ReadStrategyFlow"]>>
}

export type PublicApiService = Service<PublicApiOperationName>

export const isPublicApiInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
}
