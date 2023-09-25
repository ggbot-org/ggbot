import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { ApiActionInput } from "./apiAction.js"

const publicApiActionTypes = ["ReadStrategy", "ReadStrategyFlow"] as const
export type PublicApiActionType = (typeof publicApiActionTypes)[number]
const isPublicApiActionType =
	isLiteralType<PublicApiActionType>(publicApiActionTypes)

type PublicApiActionRequestData = ApiActionInput<PublicApiActionType>

export const isPublicApiActionRequestData =
	objectTypeGuard<PublicApiActionRequestData>(({ type }) =>
		isPublicApiActionType(type)
	)
