import { Account, AccountInfo, AccountKey, isAccountKey, isEmailAddress } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"
import { AuthDatabaseAction, AuthDatabaseActionInput } from "./auth.js"
import { ExecutorAction } from "./executor.js"

export type AdminDatabaseAction = {
	ReadAccountInfo: (arg: AccountKey) => Promise<AccountInfo | null>
} &
 Pick<AuthDatabaseAction, "ReadEmailAccount"> &
 Pick<ExecutorAction, "ListAccountKeys">

type AdminDatabaseActionType = keyof AdminDatabaseAction

export type AdminDatabaseActionInput = {
	ListAccountKeys: Parameters<AdminDatabaseAction["ListAccountKeys"]>[0]
	ReadAccountInfo: Parameters<AdminDatabaseAction["ReadAccountInfo"]>[0]
} & Pick<AuthDatabaseActionInput, "ReadEmailAccount">

type AdminDatabaseActionOutput = {
	ListAccountKeys: Awaited<ReturnType<AdminDatabaseAction["ListAccountKeys"]>>
	ReadAccountInfo: Awaited<ReturnType<AdminDatabaseAction["ReadAccountInfo"]>>
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
	ListAccountKeys: objectTypeGuard<AdminClientActionInput["ListAccountKeys"]>(({ token }) => token === undefined || typeof token === "string"),
	ReadAccount: isAccountKey
}

export const adminClientActions: ActionTypes<AdminClientActionType> = [
	"ListAccountKeys",
	"ReadAccountInfo",
	"EnterAsUser",
] as const
