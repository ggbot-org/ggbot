import { logging } from "_/logging"
import type { ManagedCacheProvider } from "@workspace/cache"
import { isStrategy, Strategy } from "@workspace/models"
import { isNonEmptyString, NonEmptyString } from "@workspace/type-utils"

import { itemKey } from "./itemKeys"
import type { WebStorageProvider } from "./provider"

const { info } = logging("local-storage")

class LocalWebStorage implements WebStorageProvider {
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

export const localWebStorage = new LocalWebStorage()
