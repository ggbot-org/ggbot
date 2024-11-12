import { cachedBoolean, cachedString } from './cache.js'
import { itemKey } from './items.js'
import { LocalWebStorageProvider } from './providers.js'

const storage = new LocalWebStorageProvider()

export class LocalWebStorage {
	get authToken() {
		return cachedString(storage, itemKey.authToken())
	}

	get hideInactiveStrategies() {
		return cachedBoolean(storage, itemKey.hideInactiveStrategies())
	}

	clear() {
		storage.clear()
	}
}
