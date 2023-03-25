import { isLiteralType } from "@ggbot2/type-utils";

export const dflowBinanceKlineIntervals = [
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
] as const;

export type DflowBinanceKlineInterval =
  typeof dflowBinanceKlineIntervals[number];

export const isDflowBinanceKlineInterval =
  isLiteralType<DflowBinanceKlineInterval>(dflowBinanceKlineIntervals);

export const dflowBinanceLowerKlineInterval = dflowBinanceKlineIntervals[0];
