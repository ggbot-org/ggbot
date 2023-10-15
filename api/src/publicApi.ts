import { ReadStrategy, ReadStrategyFlow } from "@workspace/models"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { ApiActionInput } from "./apiAction.js"
import { ApiService } from "./apiService.js"

const publicApiActionTypes = ["ReadStrategy", "ReadStrategyFlow"] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]
const isPublicApiActionType =
	isLiteralType<PublicApiActionType>(publicApiActionTypes)

type PublicApiActionRequestData = ApiActionInput<PublicApiActionType>

export const isPublicApiActionRequestData =
	objectTypeGuard<PublicApiActionRequestData>(({ type }) =>
		isPublicApiActionType(type)
	)

export type PublicApiDataProvider = {
	readStrategy: ReadStrategy
	readStrategyFlow: ReadStrategyFlow
}

export type PublicApiService = ApiService<
	PublicApiActionType,
	PublicApiDataProvider
>
