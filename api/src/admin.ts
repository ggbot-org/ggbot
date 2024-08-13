import { Account, AccountKey, isAccountKey, isEmailAddress } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"
import { AuthDatabaseAction, AuthDatabaseActionInput } from "./auth.js"

export type AdminDatabaseAction = {
	ListAccountKeys: (arg: void) => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
} & Pick<AuthDatabaseAction, "ReadEmailAccount">

type AdminDatabaseActionType = keyof AdminDatabaseAction

export type AdminDatabaseActionInput = {
	ListAccountKeys: Parameters<AdminDatabaseAction["ListAccountKeys"]>[0]
	ReadAccount: Parameters<AdminDatabaseAction["ReadAccount"]>[0]
} & Pick<AuthDatabaseActionInput, "ReadEmailAccount">

export type AdminDatabaseActionOutput = {
	ListAccountKeys: Awaited<ReturnType<AdminDatabaseAction["ListAccountKeys"]>>
	ReadAccount: Awaited<ReturnType<AdminDatabaseAction["ReadAccount"]>>
}

type AdminClientAction = {
	EnterAsUser: (arg: Pick<Account, "email">) => Promise<{ token?: string }>
}

export type AdminClientActionType = keyof AdminClientAction | Exclude<AdminDatabaseActionType, "ReadEmailAccount">

export type AdminClientActionInput = Exclude<AdminDatabaseActionInput, "ReadEmailAccount"> & {
	EnterAsUser: Parameters<AdminClientAction["EnterAsUser"]>[0]
}

export type AdminClientActionOutput = Exclude<AdminDatabaseActionOutput, "ReadEmailAccount"> & {
	EnterAsUser: Awaited<ReturnType<AdminClientAction["EnterAsUser"]>>
}

export const isAdminClientActionInput = {
	EnterAsUser: objectTypeGuard<AdminClientActionInput["EnterAsUser"]>(({ email }) => isEmailAddress(email)),
	ReadAccount: isAccountKey
}

export const adminClientActions: ActionTypes<AdminClientActionType> = [
	"ListAccountKeys",
	"ReadAccount",
	"EnterAsUser",
] as const
