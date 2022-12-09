import { Time, getTime } from "@ggbot2/time";
import type { BinanceKlineInterval } from "./types.js";

export const getIntervalTime: Record<
  BinanceKlineInterval,
  (time: Time, numIntervals: number) => Time
> = {
  "1s": (time, num) =>
    getTime(time)
      .plus(1 * num)
      .seconds(),
  "1m": (time, num) =>
    getTime(time)
      .plus(1 * num)
      .minutes(),
  "3m": (time, num) =>
    getTime(time)
      .plus(2 * num)
      .minutes(),
  "5m": (time, num) =>
    getTime(time)
      .plus(5 * num)
      .minutes(),
  "15m": (time, num) =>
    getTime(time)
      .plus(15 * num)
      .minutes(),
  "30m": (time, num) =>
    getTime(time)
      .plus(30 * num)
      .minutes(),
  "1h": (time, num) =>
    getTime(time)
      .plus(1 * num)
      .hours(),
  "2h": (time, num) =>
    getTime(time)
      .plus(2 * num)
      .hours(),
  "4h": (time, num) =>
    getTime(time)
      .plus(4 * num)
      .hours(),
  "6h": (time, num) =>
    getTime(time)
      .plus(6 * num)
      .hours(),
  "8h": (time, num) =>
    getTime(time)
      .plus(8 * num)
      .hours(),
  "12h": (time, num) =>
    getTime(time)
      .plus(12 * num)
      .hours(),
  "1d": (time, num) =>
    getTime(time)
      .plus(1 * num)
      .days(),
  "3d": (time, num) =>
    getTime(time)
      .plus(3 * num)
      .days(),
  "1w": (time, num) =>
    getTime(time)
      .plus(7 * num)
      .days(),
  "1M": (time, num) =>
    getTime(time)
      .plus(1 * num)
      .months(),
};
