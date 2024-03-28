import {
	BinanceDatabaseAction,
	BinanceDatabaseActionOutput as Output,
	DocumentProviderLevel1
} from "@workspace/api"
import { AccountKey } from "@workspace/models"

import { pathname } from "./locators.js"

export class BinanceDatabase implements BinanceDatabaseAction {
	private accountKey: AccountKey
	private documentProvider: DocumentProviderLevel1

	constructor(
		accountKey: BinanceDatabase["accountKey"],
		documentProvider: BinanceDatabase["documentProvider"]
	) {
		this.accountKey = accountKey
		this.documentProvider = documentProvider
	}

	ReadBinanceApiConfig() {
		return this.documentProvider.getItem<Output["ReadBinanceApiConfig"]>(
			pathname.binanceApiConfig(this.accountKey)
		)
	}
}
