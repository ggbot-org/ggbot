import {
	AdminAction,
	AdminActionInput as Input,
	AdminActionOutput as Output,
	DocumentProviderLevel1,
} from "@workspace/api"

import { pathname } from "./locators.js"

export class AdminDatabase implements AdminAction{
	documentProvider: DocumentProviderLevel1

	constructor(documentProvider: AdminDatabase["documentProvider"]) {
		this.documentProvider = documentProvider
	}


	async ListAccountKeys( _arg: Input["ListAccountKeys"]) {
		// TODO
		return []
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

	ReadAccount( arg: Input["ReadAccount"]) {
		return this.documentProvider.getItem<Output["ReadAccount"] >(
			pathname.account(arg)
		)
	}
}

