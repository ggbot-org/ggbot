import { isLiteralType, objectTypeGuard } from "@workspace/type-utils"

import { ApiActionInput } from "./apiAction.js"

export const publicApiActionTypes = [
	"ReadStrategy",
	"ReadStrategyFlow"
] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]
export const isPublicApiActionType =
	isLiteralType<PublicApiActionType>(publicApiActionTypes)

export type PublicApiActionRequestData = ApiActionInput<PublicApiActionType>

export const isPublicApiActionRequestData =
	objectTypeGuard<PublicApiActionRequestData>(({ type }) =>
		isPublicApiActionType(type)
	)
