import { BinanceExchange, BinanceKline } from "@ggbot2/binance";
import { Frequency } from "@ggbot2/models";
import { TimeInterval, timeToTimestamp } from "@ggbot2/time";
import { FC, useEffect, useMemo, useState } from "react";
import { ChartOhlcv, ChartOhlcvProps } from "./ChartOhlcv";

type Props = {
  binance: BinanceExchange;
  symbol: string;
  timeInterval: TimeInterval;
} & Pick<Frequency, "interval">;

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

export const BinanceKlinesChart: FC<Props> = ({ binance, symbol, timeInterval, interval }) => {
  const [klines, setKlines] = useState<BinanceKline[]>([]);

  useEffect(() => {
    (async () => {
      // TODO should chunk from start to end, with limit 1000
      // according to interval
      const data = await binance.klines(symbol, interval, {
        startTime: timeInterval.start,
        endTime: timeInterval.end,
      });
      // TODO should parse data here, not in useMemo below
      setKlines(data);
    })();
  }, [binance, interval, symbol, timeInterval]);

  const { candles, volume } = useMemo(() => klinesToCandlesAndVolume(klines), [klines]);

  return (
    <div className="grow max-w-md shadow dark:shadow-black p-2">
      <span className="text-sm">{symbol}</span>
      <div>
        <ChartOhlcv candles={candles} volume={volume} height={180} />
      </div>
    </div>
  );
};
