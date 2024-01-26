import {
	DocumentProviderLevel1,
	AdminActionInput as Input,
	AdminActionOutput as Output,
	AdminDataprovider
} from "@workspace/api"

import { pathname } from "./locators.js"

export class AdminDatabase implements AdminDataprovider{
	documentProvider: DocumentProviderLevel1

	constructor(documentProvider: AdminDatabase["documentProvider"]) {
		this.documentProvider = documentProvider
	}

	async ListAccountKeys( _arg: Input["ListAccountKeys"]) {
		// TODO
		return []
	}

	ReadAccount( arg: Input["ReadAccount"]) {
		return this.documentProvider.getItem<Output["ReadAccount"] >(
			pathname.account(arg)
		)
	}
}

