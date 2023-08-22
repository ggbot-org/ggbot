import type { ManagedCacheProvider } from "@ggbot2/cache"

import type { WebStorageProvider } from "./provider.js"

export const cachedBoolean = (
	storage: WebStorageProvider,
	key: string
): ManagedCacheProvider<boolean> => ({
	get: () => Boolean(storage.getItem(key)),
	set: (value: boolean) => {
		storage.setItem(key, String(value))
	},
	delete: () => {
		storage.removeItem(key)
	}
})
