import { AccountInfo, AccountStrategy } from "@workspace/models"

import { cachedBoolean, cachedObject } from "./cache.js"
import { itemKey } from "./items.js"
import { SessionWebStorageProvider } from "./providers.js"

export class SessionWebStorage {
	private storage = new SessionWebStorageProvider()

	get accountInfo() {
		return cachedObject<AccountInfo>(this.storage, itemKey.accountInfo())
	}

	get accountStrategies() {
		return cachedObject<AccountStrategy[]>(
			this.storage,
			itemKey.accountStrategies()
		)
	}

	get doNotShowPleasePurchase() {
		return cachedBoolean(this.storage, itemKey.doNotShowPleasePurchase())
	}

	get gotFirstPageView() {
		return cachedBoolean(this.storage, itemKey.gotFirstPageView())
	}

	clear() {
		this.storage.clear()
	}
}
