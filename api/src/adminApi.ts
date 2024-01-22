import { Account, AccountKey } from "@workspace/models"

import { Service } from "./service.js"

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]

type Input = {
	ListAccountKeys: void
	ReadAccount: AccountKey
}

type Operation = {
	ListAccountKeys: (arg: Input["ListAccountKeys"]) => Promise<AccountKey[]>
	ReadAccount: (arg: Input["ReadAccount"]) => Promise<Account | null>
}

export type AdminApiDataProviderOperation = Operation

export type AdminApiDataProvider = {
	listAccountKeys: Operation["ListAccountKeys"]
	readAccount: Operation["ReadAccount"]
}

export type AdminApiService = Service<AdminApiActionType, AdminApiDataProvider>
