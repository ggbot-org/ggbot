/** Key-value storage with optional timeToLive. */
export type CacheProvider<Data> = {
	/** Read item from cache, if any. */
	get(key: string): Data | undefined
	/** Add item `value` to cache. No `timeToLive` means item is cached for ever. */
	set(key: string, value: Data, timeToLive?: number): void
	/** Remove item from cache. */
	delete(key: string): void
}

/** Same methods as `CacheProvider` but can have arbitrary arguments. */
export type ManagedCacheProvider<Data> = {
	/**
	 * Read item from cache.
	 * Arguments can be any or none but it should always return data, if any.
	 */
	get(...args: any[]): Data | undefined
	/** Set item value. */
	set(...args: any[]): void
	/** Remove item. */
	delete(...args: any[]): void
}
