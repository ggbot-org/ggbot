import { logging } from "_/logging"
import { PageName } from "_/routing/pageNames"
import type { ManagedCacheProvider } from "@workspace/cache"
import { isLiteralType } from "minimal-type-guard-helpers"

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

	get doNotShowPleaseConfigureBinance() {
		return cachedBoolean(
			this.storage,
			itemKey.doNotShowPleaseConfigureBinance()
		)
	}

	get doNotShowPleasePurchase(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this.storage, itemKey.doNotShowPleasePurchase())
	}

	get gotFirstPageView(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this.storage, itemKey.gotFirstPageView())
	}

	clear() {
		this.storage.clear()
	}

	getActiveTabId<TabId extends string>(
		pageName: PageName,
		tabIds: readonly TabId[]
	): TabId | undefined {
		const value = this.storage.getItem(itemKey.activeTabId(pageName))
		if (isLiteralType<TabId>(tabIds)(value)) return value
	}

	setActiveTabId<TabId extends string>(pageName: PageName, value: TabId) {
		this.storage.setItem(itemKey.activeTabId(pageName), value)
	}
}

export const sessionWebStorage = new SessionWebStorage()
