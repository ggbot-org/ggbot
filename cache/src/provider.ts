import { Time } from "@ggbot2/time";

export type CacheProvider<Data> = {
  /** Read item from cache, if any. */
  get(key: string): Data | undefined;
  /** Add item `value` to cache. No `timeToLive` means item is cached for ever. */
  set(key: string, value: Data, timeToLive?: Time): void;
  /** Remove item from cache. */
  delete(key: string): void;
};
