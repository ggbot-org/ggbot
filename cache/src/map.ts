/**
 * Implements a simple cache with Maps.
 *
 * @example
 *
 * ```ts
 *   const isValidValueCache = new CacheMap<boolean>()
 *
 *   async function isValid(value: unkown): boolean {
 *     if (typeof value !== 'string') return false;
 *     // Here the value is used also as its key.
 *     // Return cached value, if any.
 *     const cached = isValidValueCache.get(value);
 *     // Notice that in this case data type is `boolean` so it is necessary to check that
 *     // it is not `undefined`. In most cases `if (cached) return cached;` will be enough.
 *     if (cached !== undefined) return cached;
 *     // Validate value with some logic.
 *     const isValid = await validateValue(value);
 *     // Add result to cache.
 *     isValidValueCache.set(value, isValid);
 *     // Finally return result.
 *     return isValid.
 *   }
 * ```
 */
export class CacheMap<Data> {
	/**
	 * A time duration expressed in milliseconds.
	 * If it is undefined, it means it lives for ever.
	 */
	timeToLive: number | undefined

	itemMap = new Map<string, Data>()
	timeToLiveMap = new Map<string, number>()
	whenUpdatedMap = new Map<string, number>()

	constructor(timeToLive?: number) {
		if (timeToLive) this.timeToLive = timeToLive
	}

	set(key: string, value: Data) {
		this.itemMap.set(key, value)
		if (this.timeToLive) this.whenUpdatedMap.set(key, Date.now())
	}

	get(key: string) {
		if (!this.itemMap.has(key)) return
		// No `timeToLive` found means item is cached for ever.
		if (!this.timeToLive) return this.itemMap.get(key)
		// No `whenUpdated` found means it is not possible to know if it is up to date.
		const whenUpdated = this.whenUpdatedMap.get(key)
		// If is not up to date, delete item and return.
		if (!whenUpdated || (whenUpdated + this.timeToLive < Date.now())) {
			this.delete(key)
			return
		}
		return this.itemMap.get(key)
	}

	delete(key: string) {
		this.itemMap.delete(key)
		this.timeToLiveMap.delete(key)
		this.whenUpdatedMap.delete(key)
	}
}
