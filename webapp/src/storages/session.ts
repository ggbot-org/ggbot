import { logging } from "_/logging"
import { PageName } from "_/routing/pageNames"
import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@workspace/binance"
import type { ManagedCacheProvider } from "@workspace/cache"
import { binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols } from "@workspace/dflow"
import { isLiteralType } from "minimal-type-guard-helpers"

import { cachedBoolean, itemKey, WebStorageProvider } from "./WebStorage"

const { info, warn } = logging("session-storage")

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

	/** Avoids running `isBinanceExchangeInfo` type-guard multiple times. */
	private binanceExchangeInfoIsValid: boolean | undefined

	get binanceExchangeInfo(): BinanceExchangeInfo | undefined {
		const key = itemKey.binanceExchangeInfo()
		const value = this.storage.getItem(key)
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
				this.storage.removeItem(key)
				return
			}
			throw error
		}
	}

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

	set binanceExchangeInfo(value: BinanceExchangeInfo | undefined) {
		const key = itemKey.binanceExchangeInfo()
		if (!value) {
			this.binanceExchangeInfoIsValid = undefined
			this.storage.removeItem(key)
			return
		}
		try {
			const { symbols, ...rest } = value
			this.storage.setItem(
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
