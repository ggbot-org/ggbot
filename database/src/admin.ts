import { AdminDatabaseAction, AdminDatabaseActionInput as Input, DocumentProviderLevel3 } from "@workspace/api"
import { Account } from "@workspace/models"

import { ExecutorDatabase } from "./executor.js"
import { pathname } from "./locators.js"
import { UserDatabase } from "./user.js"

export class AdminDatabase implements AdminDatabaseAction {
	private documentProvider: DocumentProviderLevel3
	private executorDatabase: ExecutorDatabase

	constructor(documentProvider: AdminDatabase["documentProvider"]) {
		this.executorDatabase = new ExecutorDatabase(documentProvider)
		this.documentProvider = documentProvider
	}

	async ListAccounts(arg: Input["ListAccounts"]) {
		const { accountKeys, nextToken } = await this.executorDatabase.ListAccountKeys(arg)
		const accounts: Account[] = []
		for (const { accountId } of accountKeys) {
			const account = await this.documentProvider.getItem<Account>(pathname.account({ accountId }))
			if (account) accounts.push(account)
		}
		return { accounts, nextToken }
	}

	ReadAccountInfo(accountKey: Input["ReadAccountInfo"]) {
		const userDatabase = new UserDatabase(accountKey, this.documentProvider)
		return userDatabase.ReadAccountInfo()
	}
}
