import { logging } from "_/logging"
// TODO is it correct to use ManagedCacheProvider? Why not a CacheProvider?
import type { ManagedCacheProvider } from "@workspace/cache"
import { isStrategy, Strategy } from "@workspace/models"

import { cachedBoolean, itemKey, WebStorageProvider } from "./WebStorage"

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
				info(`set ${key}`)
				this.storage.setItem(key, value)
			},
			delete: () => {
				info(`delete ${key}`)
				this.storage.removeItem(key)
				this.eventTarget.dispatchEvent(
					new CustomEvent("authTokenDeleted")
				)
			}
		}
	}

	get hideInactiveStrategies(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this.storage, itemKey.hideInactiveStrategies())
	}

	get strategy(): ManagedCacheProvider<Strategy> {
		return {
			get: (strategyId: Strategy["id"]) => {
				const key = itemKey.strategy(strategyId)
				const value = this.storage.getItem(key)
				if (!value) return
				try {
					const strategy: unknown = JSON.parse(value)
					if (isStrategy(strategy)) return strategy
				} catch (error) {
					if (error instanceof SyntaxError) {
						this.storage.removeItem(key)
						return
					}
					throw error
				}
			},
			set: (strategy: Strategy) => {
				this.storage.setItem(
					itemKey.strategy(strategy.id),
					JSON.stringify(strategy)
				)
			},
			delete: (strategyId: Strategy["id"]) => {
				this.storage.removeItem(itemKey.strategy(strategyId))
			}
		}
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
