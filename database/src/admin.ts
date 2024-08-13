import { AdminDatabaseAction, AdminDatabaseActionInput as Input, DocumentProviderLevel3 } from "@workspace/api"

import { AuthDatabase } from "./auth.js"
import { ExecutorDatabase } from "./executor.js"
import { UserDatabase } from "./user.js"

export class AdminDatabase implements AdminDatabaseAction {
	private documentProvider: DocumentProviderLevel3
	private authDatabase: AuthDatabase
	private executorDatabase: ExecutorDatabase

	constructor(documentProvider: AdminDatabase["documentProvider"]) {
		this.authDatabase = new AuthDatabase(documentProvider)
		this.executorDatabase = new ExecutorDatabase(documentProvider)
		this.documentProvider = documentProvider
	}

	async ListAccountKeys(arg: Input["ListAccountKeys"]) {
		return this.executorDatabase.ListAccountKeys(arg)
	}

	ReadAccountInfo(accountKey: Input["ReadAccountInfo"]) {
		const userDatabase = new UserDatabase(accountKey, this.documentProvider)
		return userDatabase.ReadAccountInfo()
	}

	ReadEmailAccount(arg: Input["ReadEmailAccount"]) {
		return this.authDatabase.ReadEmailAccount(arg)
	}
}
