import {
	Service,
	ServiceInputValidator,
	Strategy,
	StrategyFlow,
	StrategyKey,
	isStrategyKey,
} from "@workspace/models"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]

export type PublicApiOperation = {
	ReadStrategy: (arg: StrategyKey) => Promise<Strategy | null>
	ReadStrategyFlow: ( arg: StrategyKey) => Promise<StrategyFlow | null>
}

export type PublicApiService = Service<
	PublicApiActionType
>

export const isPublicApiInput = {
	ReadStrategy: isStrategyKey,
	ReadStrategyFlow: isStrategyKey
} satisfies ServiceInputValidator<PublicApiActionType>
