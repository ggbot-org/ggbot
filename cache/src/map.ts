import type { CacheProvider } from "./providers.js"

/**
 * Implements a simple CacheProvider with Maps.
 *
 * @example
 *
 * ```ts
 *   const isValidValueCache = new CacheMap<boolean>()
 *
 *   const isValid async (value: unkown): booelan => {
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
export class CacheMap<Data> implements CacheProvider<Data> {
	/**
	 * A time duration expressed in milliseconds.
	 *
	 * @example
	 *
	 * ```ts
	 * const FIVE_MINUTES = 300_000
	 * const ONE_HOUR = 3_600_000
	 * const ONE_DAY = 86_400_000
	 * const ONE_WEEK = 604_800_000
	 * ```
	 */
	readonly timeToLive: number | undefined

	private itemMap = new Map<string, Data>()
	private timeToLiveMap = new Map<string, number>()
	private whenUpdatedMap = new Map<string, number>()

	constructor(timeToLive?: CacheMap<Data>["timeToLive"]) {
		this.timeToLive = timeToLive
	}

	set(key: string, value: Data) {
		this.itemMap.set(key, value)
		if (this.timeToLive) this.whenUpdatedMap.set(key, Date.now())
	}

	get(key: string) {
		const { itemMap, timeToLive, whenUpdatedMap } = this
		if (!itemMap.has(key)) return
		// No `timeToLive` found means item is cached for ever.
		if (!timeToLive) return itemMap.get(key)
		// No `whenUpdated` found means it is not possible to know if `isUpToDate`.
		const whenUpdated = whenUpdatedMap.get(key)
		if (!whenUpdated) {
			this.delete(key)
			return
		}
		// If is not up to date, delete item and return.
		if (whenUpdated + timeToLive > Date.now()) {
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
