import type { ManagedCacheProvider } from "@ggbot2/cache"
import { isStrategy, Strategy } from "@ggbot2/models"
import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils"
import { logging } from "@workspace/logging"

import { itemKey } from "./itemKeys.js"
import type { WebStorageProvider } from "./provider.js"

const info = logging("local-storage", IS_DEV).info

class LocalWebStorage implements WebStorageProvider {
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
