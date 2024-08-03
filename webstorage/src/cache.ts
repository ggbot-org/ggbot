import type { ManagedCacheProvider } from "@workspace/cache"

import { WebStorageProvider } from "./providers.js"

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
	set: (value: boolean) => storage.setItem(key, String(value)),
	delete: () => storage.removeItem(key),
})

export const cachedString = (storage: WebStorageProvider, key: string): ManagedCacheProvider<string> => ({
	get: () => storage.getItem(key) ?? "",
	set: (value: boolean) => storage.setItem(key, String(value)),
	delete: () => storage.removeItem(key),
})

export const cachedObject = <Data>(storage: WebStorageProvider, key: string): ManagedCacheProvider<Data> => ({
	get: () => {
		const value = storage.getItem(key)
		if (typeof value !== "string") return undefined
		try {
			return JSON.parse(value) as Data
		} catch (error) {
			if (error instanceof SyntaxError) {
				storage.removeItem(key)
				return
			}
			throw error
		}
	},
	set: (value: Data) => storage.setItem(key, JSON.stringify(value)),
	delete: () => storage.removeItem(key),
})
