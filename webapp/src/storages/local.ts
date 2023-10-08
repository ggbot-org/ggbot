import { logging } from "_/logging"
import type { ManagedCacheProvider } from "@workspace/cache"
import {
	isNonEmptyString,
	isStrategy,
	NonEmptyString,
	Strategy
} from "@workspace/models"

import { cachedBoolean } from "./cachedBoolean"
import { itemKey } from "./itemKeys"
import type { WebStorageProvider } from "./provider"

const { info } = logging("local-storage")

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

	get hideInactiveStrategies(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this.storage, itemKey.hideInactiveStrategies())
	}

	get jwt(): ManagedCacheProvider<NonEmptyString> {
		const key = itemKey.jwt()
		return {
			get: () => {
				const value = this.storage.getItem(key)
				if (isNonEmptyString(value)) return value
			},
			set: (value: NonEmptyString) => {
				this.storage.setItem(key, value)
			},
			delete: () => {
				this.storage.removeItem(key)
			}
		}
	}

	get strategy(): ManagedCacheProvider<Strategy> {
		return {
			get: (strategyId: Strategy["id"]) => {
				const key = itemKey.strategy(strategyId)
				const value = this.storage.getItem(key)
				if (!value) return
				try {
					const strategy = JSON.parse(value)
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

	clear() {
		this.storage.clear()
	}
}

export const localWebStorage = new LocalWebStorage()
