export interface CacheProvider<Data> {
  get(key: string): Data | undefined;
  set(key: string, value: Data, timeToLive?: number): void;
  delete(key: string): void;
}

type TimeToLive = "FIVE_MINUTES" | "ONE_DAY";

/**
 * A set of time durations expressed in milliseconds.
 */
const timeToLiveDuration: Record<TimeToLive, number> = {
  FIVE_MINUTES: 300_000,
  ONE_DAY: 86_400_000,
};

/**
 * Implements a simple CacheProvider with Maps.
 *
 * @example
 * ```typescript
 * const isValidValueCache = new CacheMap<boolean>()
 *
 * const isValid async (value: unkown): booelan => {
 *   if (typeof value !== 'string') return false;
 *   // Here the value is used also as its key.
 *   // Return cached value, if any.
 *   const cached = isValidValueCache.get(value);
 *   // Notice that in this case data type is boolean so it is necessary to check that
 *   // it is not undefined. In most cases `if (cached) return cached;` will be enough.
 *   if (typeof cached !== 'undefined') return cached;
 *   // Validate value with some logic.
 *   const isValid = await validateValue(value);
 *   // Add result to cache.
 *   isValidValueCache.set(value, isValid);
 *   // Finally return result.
 *   return isValid.
 * }
 * ```
 */
export class CacheMap<Data> implements CacheProvider<Data> {
  private itemMap = new Map<string, Data>();

  private timeToLiveMap = new Map<string, number>();

  private whenUpdatedMap = new Map<string, number>();

  readonly timeToLive: TimeToLive | undefined;

  constructor(timeToLive?: TimeToLive) {
    this.timeToLive = timeToLive;
  }

  get unixTimestamp() {
    return new Date().getTime();
  }

  set(key: string, value: Data) {
    this.itemMap.set(key, value);
    if (this.timeToLive) {
      this.whenUpdatedMap.set(key, this.unixTimestamp);
    }
  }

  get(key: string) {
    if (!this.itemMap.has(key)) return;

    // No `timeToLive` found means item is cached for ever.
    if (!this.timeToLive) return this.itemMap.get(key) as Data;

    const whenUpdated = this.whenUpdatedMap.get(key);
    if (!whenUpdated) return;

    const cacheDuration = timeToLiveDuration[this.timeToLive];
    const isUpToDate = whenUpdated + cacheDuration < this.unixTimestamp;
    if (isUpToDate) {
      this.delete(key);
      return;
    }

    return this.itemMap.get(key) as Data;
  }

  delete(key: string) {
    this.itemMap.delete(key);
    this.timeToLiveMap.delete(key);
    this.whenUpdatedMap.delete(key);
  }
}