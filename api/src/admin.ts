import { Account, AccountKey, isAccountKey } from "@workspace/models"

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]

type Action = {
	ListAccountKeys: () => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
}

export type AdminApiInput = {
	ReadAccount: Parameters<Action["ReadAccount"]>[0]
}

export type AdminApiOutput = {
	ListAccountKeys: Awaited<ReturnType<Action["ListAccountKeys"]>>
	ReadStrategy: Awaited<ReturnType<Action["ReadAccount"]>>
}

export type AdminApiAction = Action

export const isAdminApiInput = {
	ReadAccount: isAccountKey
}
