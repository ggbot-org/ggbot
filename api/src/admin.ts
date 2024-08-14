import { AccountInfo, AccountKey, isAccountKey } from "@workspace/models"
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
	EnterAsAccount: (arg: AccountKey) => Promise<{ token?: string }>
}

export type AdminClientActionType = keyof AdminClientAction | Exclude<AdminDatabaseActionType, "ReadEmailAccount">

export type AdminClientActionInput = Exclude<AdminDatabaseActionInput, "ReadEmailAccount"> & {
	EnterAsAccount: Parameters<AdminClientAction["EnterAsAccount"]>[0]
}

export type AdminClientActionOutput = Exclude<AdminDatabaseActionOutput, "ReadEmailAccount"> & {
	EnterAsAccount: Awaited<ReturnType<AdminClientAction["EnterAsAccount"]>>
}

export const isAdminClientActionInput = {
	EnterAsAccount: isAccountKey,
	ListAccountKeys: objectTypeGuard<AdminClientActionInput["ListAccountKeys"]>(({ token, numItems }) => (token === undefined || typeof token === "string") && (numItems === undefined || typeof numItems === "number")),
	ReadAccount: isAccountKey
}

export const adminClientActions: ActionTypes<AdminClientActionType> = [
	"ListAccountKeys",
	"ReadAccountInfo",
	"EnterAsAccount",
] as const
