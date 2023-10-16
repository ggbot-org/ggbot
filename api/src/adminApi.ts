import { ListAccountKeys, ReadAccount, Service } from "@workspace/models"

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const
export type AdminApiActionType = (typeof adminApiActionTypes)[number]

export type AdminApiDataProvider = {
	listAccountKeys: ListAccountKeys
	readAccount: ReadAccount
}

export type AdminApiService = Service<AdminApiActionType, AdminApiDataProvider>
