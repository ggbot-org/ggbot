import type { ManagedCacheProvider } from "@workspace/cache"
import { Strategy } from "@workspace/models"

export type WebStorageProvider = Pick<
	Storage,
	"getItem" | "setItem" | "removeItem" | "clear"
>

export const cachedBoolean = (
	storage: WebStorageProvider,
	key: string
): ManagedCacheProvider<boolean> => ({
	get: () => {
		const value = storage.getItem(key)
		if (typeof value !== "string") return undefined
		if (value === "true") return true
		return false
	},
	set: (value: boolean) => {
		storage.setItem(key, String(value))
	},
	delete: () => {
		storage.removeItem(key)
	}
})

const itemKeys = [
	"activeTabId",
	"authToken",
	"binanceExchangeInfo",
	"doNotShowPleaseConfigureBinance",
	"doNotShowPleasePurchase",
	"gotFirstPageView",
	"hideInactiveStrategies",
	"strategy"
] as const

type ItemKey = (typeof itemKeys)[number]

/**
 * Get item keys used by session and local storage. Every item keys includes a
 * version. Every version can be updated independently: it should be done when
 * type of value changes.
 */
export const itemKey: Record<ItemKey, (...args: any[]) => string> = {
	activeTabId: (pageName: string) => `${pageName}:activeTab:v1`,
	authToken: () => "authToken:v1",
	binanceExchangeInfo: () => "binanceExchangeInfo:v1.1.0",
	doNotShowPleaseConfigureBinance: () => "doNotShowPleaseConfigureBinance:v1",
	doNotShowPleasePurchase: () => "doNotShowPleasePurchase:v1",
	gotFirstPageView: () => "gotFirstPageView:v1",
	hideInactiveStrategies: () => "hideInactiveStrategies:v1",
	strategy: (id: Strategy["id"]) => `strategy:${id}:v1`
}