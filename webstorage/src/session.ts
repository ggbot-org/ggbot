import { cachedBoolean } from "./cache.js"
import { itemKey } from "./items.js"
import { SessionWebStorageProvider } from "./providers.js"

export class SessionWebStorage {
	private storage = new SessionWebStorageProvider()

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
