import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { ApiActionInput } from "./apiAction.js"

const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]
const isAdminApiActionType =
	isLiteralType<AdminApiActionType>(adminApiActionTypes)

type AdminApiActionRequestData = ApiActionInput<AdminApiActionType>

export const isAdminApiActionRequestData =
	objectTypeGuard<AdminApiActionRequestData>(({ type }) =>
		isAdminApiActionType(type)
	)
