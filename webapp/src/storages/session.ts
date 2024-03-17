import { logging } from "_/logging"

import { cachedBoolean, itemKey, WebStorageProvider } from "./WebStorage"

const { info } = logging("sessionStorage")

class SessionWebStorageProvider implements WebStorageProvider {
	getItem(key: string) {
		info("getItem", key)
		return window.sessionStorage.getItem(key)
	}

	setItem(key: string, value: string) {
		info("setItem", key, value.length > 170 ? "" : value)
		window.sessionStorage.setItem(key, value)
	}

	removeItem(key: string) {
		info("removeItem", key)
		window.sessionStorage.removeItem(key)
	}

	clear() {
		info("clear")
		window.sessionStorage.clear()
	}
}

class SessionWebStorage {
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

export const sessionWebStorage = new SessionWebStorage()
