import type { ManagedCacheProvider } from "@workspace/cache"
import { Account, Strategy } from "@workspace/models"

import { cachedBoolean, cachedObject } from "./cache.js"
import { itemKey } from "./items.js"
import { LocalWebStorageProvider } from "./providers.js"

type LocalWebStorageEventType = "authTokenDeleted"

export class LocalWebStorage {
	private storage = new LocalWebStorageProvider()
	private eventTarget = new EventTarget()

	get account() {
		return cachedObject<Account>(this.storage, itemKey.account())
	}

	get authToken(): ManagedCacheProvider<string> {
		const key = itemKey.authToken()
		return {
			get: () => {
				const value = this.storage.getItem(key)
				if (value) return value
			},
			set: (value: string) => {
				this.storage.setItem(key, value)
			},
			delete: () => {
				this.storage.removeItem(key)
				this.eventTarget.dispatchEvent(
					new CustomEvent("authTokenDeleted")
				)
			}
		}
	}

	get hideInactiveStrategies() {
		return cachedBoolean(this.storage, itemKey.hideInactiveStrategies())
	}

	get DEBUG_backtesting() {
		return cachedBoolean(this.storage, itemKey.DEBUG_backtesting())
	}

	strategy(strategyId: Strategy["id"]) {
		return cachedObject<Strategy>(
			this.storage,
			itemKey.strategy(strategyId)
		)
	}

	addEventListener(
		type: LocalWebStorageEventType,
		callback: EventListenerOrEventListenerObject
	): void {
		this.eventTarget.addEventListener(type, callback)
	}

	removeEventListener(
		type: LocalWebStorageEventType,
		callback: EventListenerOrEventListenerObject
	): void {
		this.eventTarget.removeEventListener(type, callback)
	}

	clear() {
		this.storage.clear()
	}

	clearAnyThingButDebugFlags() {
		const DEBUG_backtesting = this.DEBUG_backtesting.get()

		this.storage.clear()

		if (DEBUG_backtesting) this.DEBUG_backtesting.set(true)
	}
}
