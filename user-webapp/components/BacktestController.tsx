import {
  BinanceConnector,
  BinanceExchange,
  BinanceKline,
} from "@ggbot2/binance";
import { Calendar, CalendarSetSelectedDay } from "@ggbot2/ui-components";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ChartOhlcv, ChartOhlcvProps } from "_components";
import { BacktestingState, BacktestingDispatch } from "_hooks";

type Props = {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<Props> = ({ state, dispatch }) => {
  if (!state || !state.isEnabled) return null;
  const [klines, setKlines] = useState<BinanceKline[]>([]);

  const { startDay } = state;

  const setStartDay = useCallback<CalendarSetSelectedDay>(
    (day) => {
      dispatch({ type: "SET_START_DAY", day });
    },
    [dispatch]
  );

  useEffect(() => {
    async function test() {
      const binance = new BinanceExchange({
        baseUrl: BinanceConnector.defaultBaseUrl,
      });
      const klines = await binance.klines("BTCBUSD", "1d", { limit: 10 });
      setKlines(klines);
    }
    test();
  }, [setKlines]);

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
    <div className="my-2">
      <Calendar selectedDay={startDay} setSelectedDay={setStartDay} />
      <ChartOhlcv candles={candles} volume={volume} />
    </div>
  );
};
