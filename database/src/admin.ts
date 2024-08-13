import { AdminDatabaseAction, AdminDatabaseActionInput as Input, AdminDatabaseActionOutput as Output, DocumentProviderLevel3 } from "@workspace/api"

import { AuthDatabase } from "./auth.js"
import { pathname } from "./locators.js"

export class AdminDatabase implements AdminDatabaseAction {
	private documentProvider: DocumentProviderLevel3
	private authDatabase: AuthDatabase

	constructor(documentProvider: AdminDatabase["documentProvider"]) {
		this.authDatabase = new AuthDatabase(documentProvider)
		this.documentProvider = documentProvider
	}

	ListAccountKeys() {
		// TODO
		return Promise.resolve([])
	}
	// export const listAccountKeys: AdminOperation["ListAccountKeys"] = async () => {
	// 	const Prefix = dirnamePrefix.account + dirnameDelimiter
	// 	const results = await LIST({
	// 		Prefix
	// 	})
	// 	if (!Array.isArray(results.Contents)) return Promise.resolve([])
	// 	return (
	// 		results.Contents.reduce<AccountKey[]>((list, { Key }) => {
	// 			if (typeof Key !== "string") return list
	// 			const itemKey = locatorToItemKey.account(Key)
	// 			return isAccountKey(itemKey) ? list.concat(itemKey) : list
	// 		}, []) ?? []
	// 	)
	// }

	ReadAccount(arg: Input["ReadAccount"]) {
		return this.documentProvider.getItem<Output["ReadAccount"]>(pathname.account(arg))
	}

	ReadEmailAccount(arg: Input["ReadEmailAccount"]) {
		return this.authDatabase.ReadEmailAccount(arg)
	}
}
