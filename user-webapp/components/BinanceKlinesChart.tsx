import {
  BinanceExchange,
  BinanceKline,
  BinanceKlineInterval,
  binanceKlineMaxLimit,
  getBinanceIntervalTime,
} from "@ggbot2/binance";
import { TimeInterval } from "@ggbot2/time";
import { FC, useCallback, useEffect, useState, useRef } from "react";
// import { ChartOhlcv, ChartOhlcvProps } from "./ChartOhlcv";

type Props = TimeInterval & {
  binance: BinanceExchange;
  interval: BinanceKlineInterval;
  symbol: string;
};

/*
const klinesToCandlesAndVolume = (klines: BinanceKline[]) =>
  klines.reduce<Pick<ChartOhlcvProps, "candles" | "volume">>(
    (result, [openTime, open, high, low, close, volume]) => {
      const timestamp = timeToTimestamp(openTime);
      return {
        candles: result.candles.concat({
          time: timestamp,
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        }),
        volume: result.volume.concat({
          time: timestamp,
          value: parseFloat(volume),
          up: open < close,
        }),
      };
    },
    { candles: [], volume: [] }
  );
  */

export const BinanceKlinesChart: FC<Props> = ({
  binance,
  start,
  end,
  interval,
  symbol,
}) => {
  const [previousTimeInterval, setPreviousTimeInterval] = useState<
    TimeInterval | undefined
  >();
  const klines = useRef<BinanceKline[]>([]);

  const fetchKlines = useCallback(async () => {
    // Do not fetch if there are klines available.
    if (klines.current.length > 0) return;
    const data: BinanceKline[] = [];
    const startTime = start;
    let endTime =
      getBinanceIntervalTime[interval](startTime).plus(binanceKlineMaxLimit);
    let shouldFetch = true;
    while (shouldFetch) {
      const klines = await binance.klines(symbol, interval, {
        startTime,
        limit: binanceKlineMaxLimit,
      });
      data.push(...klines);
      endTime = Math.min(
        end,
        getBinanceIntervalTime[interval](endTime).plus(binanceKlineMaxLimit)
      );
      shouldFetch = endTime < end;
    }
    klines.current = data;
  }, [binance, symbol, start, end, interval, klines]);

  useEffect(() => {
    if (previousTimeInterval === undefined) {
      setPreviousTimeInterval({ start, end });
      fetchKlines();
    } else if (
      start < previousTimeInterval.start ||
      end > previousTimeInterval.end
    ) {
      // Reset klines, and fetch them.
      klines.current = [];
      fetchKlines();
    }
  }, [fetchKlines, start, end, klines, previousTimeInterval]);

  // const { candles, volume } = useMemo(() => klinesToCandlesAndVolume(klines), [klines]);

  return (
    <div>
      {/* TODO need to restore ChartOhlcv
    <div className="grow max-w-md shadow dark:shadow-black p-2">
      <span className="text-sm">{symbol}</span>
      <div>
        <ChartOhlcv candles={candles} volume={volume} height={180} />
      </div>
    */}
    </div>
  );
};
