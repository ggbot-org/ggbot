import type { BinanceExchange, BinanceKline } from "@ggbot2/binance";
import type { TimeInterval } from "@ggbot2/time";
import { FC, useEffect, useMemo, useState } from "react";
import { ChartOhlcv, ChartOhlcvProps } from "./ChartOhlcv";

type Props = {
  binance: BinanceExchange;
  symbol: string;
  timeInterval: TimeInterval;
};

export const BinanceKlinesChart: FC<Props> = ({
  binance,
  symbol,
  timeInterval,
}) => {
  const [klines, setKlines] = useState<BinanceKline[]>([]);

  useEffect(() => {
    (async () => {
      const data = await binance.klines(symbol, "1d", {
        startTime: timeInterval.start,
        endTime: timeInterval.end,
      });
      setKlines(data);
    })();
  }, [binance, setKlines, symbol, timeInterval]);

  const { candles, volume } = useMemo(
    () =>
      klines.reduce<Pick<ChartOhlcvProps, "candles" | "volume">>(
        (result, [openTime, open, high, low, close, volume]) => {
          const time = new Date(openTime).toJSON();
          return {
            candles: result.candles.concat({
              time,
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
            }),
            volume: result.volume.concat({
              time,
              value: parseFloat(volume),
              up: open < close,
            }),
          };
        },
        { candles: [], volume: [] }
      ),
    [klines]
  );

  return (
    <div className="grow max-w-md shadow dark:shadow-black p-2">
      <span className="text-sm">{symbol}</span>
      <div>
        <ChartOhlcv candles={candles} volume={volume} height={180} />
      </div>
    </div>
  );
};
