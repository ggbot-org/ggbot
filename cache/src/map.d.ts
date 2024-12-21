/**
 * Implements a simple cache with Maps.
 *
 * @example
 *
 * ```ts
 * const isValidValueCache = new CacheMap<boolean>()
 *
 * async function isValid(value: unkown): boolean {
 *   if (typeof value !== 'string') return false
 *   // Here the value is used also as its key.
 *   // Return cached value, if any.
 *   const cached = isValidValueCache.get(value)
 *   // Notice that in this case data type is `boolean` so it is necessary to check that
 *   // it is not `undefined`. In most cases `if (cached) return cached;` will be enough.
 *   if (cached !== undefined) return cached
 *   // Validate value with some logic.
 *   const isValid = await validateValue(value)
 *   // Add result to cache.
 *   isValidValueCache.set(value, isValid)
 *   // Finally return result.
 *   return isValid
 * }
 * ```
 */
export declare class CacheMap<Data> {
	/**
	 * timeToLive is a time duration expressed in milliseconds
	 */
	constructor(timeToLive: number)
	set(key: string, value: Data): void
	get(key: string): Data | undefined
	delete(key: string): void
}
