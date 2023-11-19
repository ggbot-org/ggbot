import type { ManagedCacheProvider } from "@workspace/cache"

import type { WebStorageProvider } from "./provider"

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
