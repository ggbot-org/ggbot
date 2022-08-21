export interface CacheProvider<Data> {
  get(key: string): Data | undefined;
  set(key: string, value: Data, timeToLive?: number): void;
  delete(key: string): void;
}

/**
 * A set of time durations expressed in milliseconds
 */
export const TimeToLive = {
  FOR_EVER: 0,
  FIVE_MINUTES: 300_000,
  ONE_DAY: 86_400_000,
};

export class CacheMap<Data> implements CacheProvider<Data> {
  private item = new Map<string, Data>();
  private timeToLive = new Map<string, number>();
  private whenUpdated = new Map<string, number>();

  get unixTimestamp() {
    return new Date().getTime();
  }

  set(key: string, value: Data, timeToLive = TimeToLive.FOR_EVER) {
    this.item.set(key, value);
    if (timeToLive) {
      this.timeToLive.set(key, timeToLive);
      this.whenUpdated.set(key, this.unixTimestamp);
    }
  }

  get(key: string) {
    const data = this.item.get(key);
    if (!data) return;

    const timeToLive = this.timeToLive.get(key);
    // No `timeToLive` found means item has FOR_EVER TimeToLive.
    if (!timeToLive) return data;

    const whenUpdated = this.whenUpdated.get(key);
    if (!whenUpdated) return;

    const isUpToDate = whenUpdated + timeToLive < this.unixTimestamp;
    if (isUpToDate) {
      this.delete(key);
      return;
    }

    return data;
  }

  delete(key: string) {
    this.item.delete(key);
    this.timeToLive.delete(key);
    this.whenUpdated.delete(key);
  }
}
