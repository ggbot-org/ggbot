import { isLiteralType, objectTypeGuard } from "@workspace/type-utils"

import { ApiActionInput } from "./apiAction.js"

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]
export const isAdminApiActionType =
	isLiteralType<AdminApiActionType>(adminApiActionTypes)

export type AdminApiActionRequestData = ApiActionInput<AdminApiActionType>

export const isAdminApiActionRequestData =
	objectTypeGuard<AdminApiActionRequestData>(({ type }) =>
		isAdminApiActionType(type)
	)
