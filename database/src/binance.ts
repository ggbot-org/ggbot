import { BinanceDatabaseAction, BinanceDatabaseActionOutput as Output, DocumentProviderLevel1 } from '@workspace/api'
import { AccountKey } from '@workspace/models'

import { pathname } from './locators.js'

export class BinanceDatabase implements BinanceDatabaseAction {
	accountKey: AccountKey
	documentProvider: DocumentProviderLevel1

	constructor(accountKey: AccountKey, documentProvider: DocumentProviderLevel1) {
		this.accountKey = accountKey
		this.documentProvider = documentProvider
	}

	ReadBinanceApiConfig() {
		return this.documentProvider.getItem<Output['ReadBinanceApiConfig']>(pathname.binanceApiConfig(this.accountKey))
	}
}
