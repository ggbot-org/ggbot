import { logging } from "_/logging"
import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@workspace/binance"
import type { ManagedCacheProvider } from "@workspace/cache"
import { binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols } from "@workspace/dflow"
import { isLiteralType } from "minimal-type-guard-helpers"

import { cachedBoolean } from "./cachedBoolean"
import { itemKey } from "./itemKeys"
import type { WebStorageProvider } from "./provider"

const { info, warn } = logging("session-storage")

class SessionWebStorage implements WebStorageProvider {
	/** Avoids running `isBinanceExchangeInfo` type-guard multiple times. */
	private binanceExchangeInfoIsValid: boolean | undefined

	get doNotShowPleaseConfigureBinance() {
		return cachedBoolean(this, itemKey.doNotShowPleaseConfigureBinance())
	}

	get doNotShowPleasePurchase(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this, itemKey.doNotShowPleasePurchase())
	}

	get gotFirstPageView(): ManagedCacheProvider<boolean> {
		return cachedBoolean(this, itemKey.gotFirstPageView())
	}

	get binanceExchangeInfo(): BinanceExchangeInfo | undefined {
		const key = itemKey.binanceExchangeInfo()
		const value = this.getItem(key)
		if (!value) return
		try {
			const binanceExchangeInfo = JSON.parse(value)
			if (this.binanceExchangeInfoIsValid) {
				return binanceExchangeInfo as BinanceExchangeInfo
			}
			if (isBinanceExchangeInfo(binanceExchangeInfo)) {
				this.binanceExchangeInfoIsValid = true
				return binanceExchangeInfo
			}
		} catch (error) {
			if (error instanceof SyntaxError) {
				this.removeItem(key)
				return
			}
			throw error
		}
	}

	set binanceExchangeInfo(value: BinanceExchangeInfo | undefined) {
		const key = itemKey.binanceExchangeInfo()
		if (!value) {
			this.removeItem(key)
			return
		}
		try {
			const { symbols, ...rest } = value
			this.setItem(
				key,
				JSON.stringify({
					...rest,
					symbols:
						binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
							symbols
						)
				})
			)
			this.binanceExchangeInfoIsValid = true
		} catch (error) {
			warn(error)
		}
	}

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
		if (key === itemKey.binanceExchangeInfo())
			this.binanceExchangeInfoIsValid = undefined

		window.sessionStorage.removeItem(key)
	}

	clear() {
		info("clear")
		window.sessionStorage.clear()
	}

	getActiveTabId<TabId extends string>(
		pageName: string,
		tabIds: readonly TabId[]
	): TabId | undefined {
		const value = this.getItem(itemKey.activeTabId(pageName))
		if (isLiteralType<TabId>(tabIds)(value)) return value
	}

	setActiveTabId<TabId extends string>(pageName: string, value: TabId) {
		this.setItem(itemKey.activeTabId(pageName), value)
	}
}

export const sessionWebStorage = new SessionWebStorage()
