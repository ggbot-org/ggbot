import {
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceKline,
} from "@ggbot2/binance";
import { extractBinanceSymbolsFromFlow } from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChartOhlcv,
  ChartOhlcvProps,
  DailyIntervalSelector,
  DailyIntervalSelectorProps,
} from "_components";
import { binance } from "_flow/binance";
import { BacktestingState, BacktestingDispatch } from "_hooks";
import { StrategyFlow } from "_routing";

type BacktestControllerProps = Partial<Pick<StrategyFlow, "view">> & {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<BacktestControllerProps> = ({
  state,
  dispatch,
  view,
}) => {
  const setStartDay = useCallback<DailyIntervalSelectorProps["setStartDay"]>(
    (day) => {
      const endDay = state?.endDay;
      if (!endDay) return;
      dispatch({ type: "SET_INTERVAL", startDay: day, endDay });
    },
    [dispatch, state?.endDay]
  );

  if (!state || !state.isEnabled) return null;

  const { maxDay, startDay, strategyKind } = state;

  return (
    <div className="my-2">
      <DailyIntervalSelector
        max={maxDay}
        startDay={startDay}
        setStartDay={setStartDay}
      />
      {strategyKind === "binance" && view && state && (
        <BacktestControllerBinance
          state={state}
          dispatch={dispatch}
          view={view}
        />
      )}
    </div>
  );
};

type BacktestControllerBinanceProps = Pick<StrategyFlow, "view"> & {
  state: BacktestingState;
  dispatch: BacktestingDispatch;
};

const BacktestControllerBinance: FC<BacktestControllerBinanceProps> = ({
  state: { startDay, maxDay },
  dispatch,
  view,
}) => {
  const [exchangeInfo, setExchangeInfo] = useState<
    BinanceExchangeInfo | undefined
  >();

  const onClickStart = useCallback(() => {
    dispatch({ type: "START" });
  }, [dispatch]);

  const selectedSymbols = useMemo<string[] | undefined>(() => {
    if (!exchangeInfo) return;
    if (!view) return;

    return extractBinanceSymbolsFromFlow({
      binanceSymbols: exchangeInfo.symbols,
      view,
    });
  }, [exchangeInfo, view]);

  useEffect(() => {
    (async () => {
      try {
        const exchangeInfo = await binance.exchangeInfo();
        setExchangeInfo(exchangeInfo);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [setExchangeInfo]);

  const { startTime, endTime } = useMemo(() => {
    return {
      startTime: new Date(startDay).getTime(),
      endTime: new Date(maxDay).getTime(),
    };
  }, [startDay, maxDay]);

  if (!Array.isArray(selectedSymbols)) return null;

  return (
    <div>
      {selectedSymbols.length === 0 ? (
        <div className="my-2 h-48 flex flex-col justify-center">
          <span>No symbol found in strategy flow.</span>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap justify-start gap-2">
          {selectedSymbols.map((symbol) => (
            <BinanceKlinesChart
              key={symbol}
              binance={binance}
              symbol={symbol}
              startTime={startTime}
              endTime={endTime}
            />
          ))}
        </div>
      )}
      <menu>
        <Button onClick={onClickStart}>Start</Button>
      </menu>
    </div>
  );
};

type BinanceKlinesChartProps = {
  binance: BinanceExchange;
  symbol: string;
  startTime: number;
  endTime: number;
};

export const BinanceKlinesChart: FC<BinanceKlinesChartProps> = ({
  binance,
  symbol,
  startTime,
  endTime,
}) => {
  const [klines, setKlines] = useState<BinanceKline[]>([]);

  useEffect(() => {
    (async () => {
      const data = await binance.klines(symbol, "1d", {
        startTime,
        endTime,
      });
      setKlines(data);
    })();
  }, [binance, setKlines, symbol, startTime, endTime]);

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
