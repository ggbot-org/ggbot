import { Account, AccountKey, isAccountKey } from "@workspace/models"

import { ActionTypes } from "./action.js"

export type AdminAction = {
	ListAccountKeys: (arg: void) => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
}

export type AdminActionType = keyof AdminAction

export const adminActions: ActionTypes<AdminActionType> = [
	"ListAccountKeys",
	"ReadAccount"
] as const

export type AdminActionInput = {
	ListAccountKeys: Parameters<AdminAction["ListAccountKeys"]>[0]
	ReadAccount: Parameters<AdminAction["ReadAccount"]>[0]
}

export type AdminActionOutput = {
	ListAccountKeys: Awaited<ReturnType<AdminAction["ListAccountKeys"]>>
	ReadAccount: Awaited<ReturnType<AdminAction["ReadAccount"]>>
}

export const isAdminActionInput = {
	ReadAccount: isAccountKey
}
