import type { ManagedCacheProvider } from "@workspace/cache"

import { WebStorageProvider } from "./providers.js"

export function cachedBoolean (
	storage: WebStorageProvider,
	key: string
): ManagedCacheProvider<boolean> {
	return ({
		get: () => {
			const value = storage.getItem(key)
			if (typeof value !== "string") return undefined
			if (value === "true") return true
			return false
		},
		set: (value: boolean) => storage.setItem(key, String(value)),
		delete: () => storage.removeItem(key)
	})
}

export function cachedString(storage: WebStorageProvider, key: string): ManagedCacheProvider<string> {
	return ({
		get: () => storage.getItem(key) ?? "",
		set: (value: boolean) => storage.setItem(key, String(value)),
		delete: () => storage.removeItem(key)
	})
}

export function cachedNumber(storage: WebStorageProvider, key: string): ManagedCacheProvider<number> {
	return ({
		get: () => {
			const value = storage.getItem(key)
			if (value === null) return undefined
			const num = Number(value)
			if (Number.isFinite(num)) return num
			else storage.removeItem(key)
		},
		set: (value: number) => storage.setItem(key, String(value)),
		delete: () => storage.removeItem(key)
	})
}

export function cachedObject<Data>(storage: WebStorageProvider, key: string): ManagedCacheProvider<Data> {
	return ({
		get: () => {
			const value = storage.getItem(key)
			if (typeof value !== "string") return undefined
			try {
				return JSON.parse(value) as Data
			} catch (error) {
				if (error instanceof SyntaxError) storage.removeItem(key)
				else throw error
			}
		},
		set: (value: Data) => storage.setItem(key, JSON.stringify(value)),
		delete: () => storage.removeItem(key)
	})
}
