import { logging } from "_/logging"
import type { ManagedCacheProvider } from "@workspace/cache"
import { Strategy } from "@workspace/models"

import {
	cachedBoolean,
	cachedObject,
	itemKey,
	WebStorageProvider
} from "./WebStorage"

const { info } = logging("localStorage")

type LocalWebStorageEventType = "authTokenDeleted"

class LocalWebStorageProvider implements WebStorageProvider {
	getItem(key: string) {
		const value = window.localStorage.getItem(key)
		info("getItem", key, value)
		return value
	}

	setItem(key: string, value: string) {
		info("setItem", key, value)
		window.localStorage.setItem(key, value)
	}

	removeItem(key: string) {
		info("removeItem", key)
		window.localStorage.removeItem(key)
	}

	clear() {
		info("clear")
		window.localStorage.clear()
	}
}

class LocalWebStorage {
	private storage = new LocalWebStorageProvider()
	private eventTarget = new EventTarget()

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
}

export const localWebStorage = new LocalWebStorage()
