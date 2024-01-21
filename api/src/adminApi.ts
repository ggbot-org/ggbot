import { Account, AccountKey } from "@workspace/models"

import { Service } from "./service.js"

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]

export type ListAccountKeys = () => Promise<AccountKey[]>

export type ReadAccount = (arg: AccountKey) => Promise<Account | null>

export type AdminApiDataProvider = {
	listAccountKeys: ListAccountKeys
	readAccount: ReadAccount
}

export type AdminApiService = Service<AdminApiActionType, AdminApiDataProvider>
