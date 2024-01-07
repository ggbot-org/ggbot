import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { ApiActionInput } from "./apiAction.js"

const utrustApiActionTypes = ["CreateUtrustOrder"] as const
type UtrustApiActionType = (typeof utrustApiActionTypes)[number]
const isUtrustApiActionType =
	isLiteralType<UtrustApiActionType>(utrustApiActionTypes)

type UtrustApiActionRequestData = ApiActionInput<UtrustApiActionType>

export const isUtrustApiActionRequestData =
	objectTypeGuard<UtrustApiActionRequestData>(({ type }) =>
		isUtrustApiActionType(type)
	)

export type UtrustApiCallabackRequestData = {
	ok: boolean
}
