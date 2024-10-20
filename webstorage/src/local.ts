import type { ManagedCacheProvider } from "@workspace/cache"

import { cachedBoolean, cachedString } from "./cache.js"
import { itemKey } from "./items.js"
import { LocalWebStorageProvider } from "./providers.js"

export class LocalWebStorage {
	private storage = new LocalWebStorageProvider()

	get authToken(): ManagedCacheProvider<string> {
		return cachedString(this.storage, itemKey.authToken())
	}

	get hideInactiveStrategies() {
		return cachedBoolean(this.storage, itemKey.hideInactiveStrategies())
	}

	clear() {
		this.storage.clear()
	}
}
