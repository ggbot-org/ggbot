import type { ManagedCacheProvider } from "@ggbot2/cache"
import { isDev } from "@ggbot2/env"
import { isStrategy, Strategy } from "@ggbot2/models"
import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils"

import { itemKey } from "./itemKeys.js"
import type { WebStorageProvider } from "./provider.js"

class LocalWebStorage implements WebStorageProvider {
	getItem(key: string) {
		if (isDev) console.info("web-storage", "local", "getItem", key)
		return window.localStorage.getItem(key)
	}

	setItem(key: string, value: string) {
		if (isDev) console.info("web-storage", "local", "setItem", key, value)
		window.localStorage.setItem(key, value)
	}

	removeItem(key: string) {
		if (isDev) console.info("web-storage", "local", "removeItem", key)
		window.localStorage.removeItem(key)
	}

	clear() {
		if (isDev) console.info("web-storage", "local", "clear")
		window.localStorage.clear()
	}

	get jwt(): ManagedCacheProvider<NonEmptyString> {
		const key = itemKey.jwt()
		return {
			get: () => {
				const value = this.getItem(key)
				if (isNonEmptyString(value)) return value
			},
			set: (value: NonEmptyString) => {
				this.setItem(key, value)
			},
			delete: () => {
				this.removeItem(key)
			}
		}
	}

	get strategy(): ManagedCacheProvider<Strategy> {
		return {
			get: (strategyId: Strategy["id"]) => {
				const key = itemKey.strategy(strategyId)
				const value = this.getItem(key)
				if (!value) return
				try {
					const strategy = JSON.parse(value)
					if (isStrategy(strategy)) return strategy
				} catch (error) {
					if (error instanceof SyntaxError) {
						this.removeItem(key)
						return
					}
					throw error
				}
			},
			set: (strategy: Strategy) => {
				this.setItem(
					itemKey.strategy(strategy.id),
					JSON.stringify(strategy)
				)
			},
			delete: (strategyId: Strategy["id"]) => {
				this.removeItem(itemKey.strategy(strategyId))
			}
		}
	}
}

export const localWebStorage = new LocalWebStorage()
