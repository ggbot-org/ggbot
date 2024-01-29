import { Account, AccountKey, isAccountKey } from "@workspace/models"

import { Actions } from "./action.js"

type Action = {
	ListAccountKeys: (arg: void) => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
}
export type AdminAction = Action
type ActionType = keyof Action
export const adminActions: Actions<ActionType> = [
	"ListAccountKeys",
	"ReadAccount"
] as const
export type AdminActionType = keyof AdminAction

export type AdminActionInput = {
	ReadAccount: Parameters<Action["ReadAccount"]>[0]
}

export type AdminActionOutput = {
	ListAccountKeys: Awaited<ReturnType<Action["ListAccountKeys"]>>
	ReadAccount: Awaited<ReturnType<Action["ReadAccount"]>>
}

export const isAdminActionInput = {
	ReadAccount: isAccountKey
}
