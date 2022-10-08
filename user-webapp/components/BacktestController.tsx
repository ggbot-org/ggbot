import {
  BinanceConnector,
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceKline,
} from "@ggbot2/binance";
import { extractBinanceSymbolsFromFlow } from "@ggbot2/dflow";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChartOhlcv,
  ChartOhlcvProps,
  DailyIntervalSelector,
  DailyIntervalSelectorProps,
} from "_components";
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
  if (!state || !state.isEnabled) return null;

  const { maxDay, startDay, strategyKind } = state;

  const setStartDay = useCallback<DailyIntervalSelectorProps["setStartDay"]>(
    (day) => {
      dispatch({ type: "SET_START_DAY", day });
    },
    [dispatch]
  );

  return (
    <div className="my-2">
      <DailyIntervalSelector
        max={maxDay}
        startDay={startDay}
        setStartDay={setStartDay}
      />
      {strategyKind === "binance" && view && state && (
        <BacktestControllerBinance state={state} view={view} />
      )}
    </div>
  );
};

type BacktestControllerBinanceProps = Pick<StrategyFlow, "view"> & {
  state: BacktestingState;
};

const BacktestControllerBinance: FC<BacktestControllerBinanceProps> = ({
  state: { startDay, maxDay },
  // dispatch,
  view,
}) => {
  const [exchangeInfo, setExchangeInfo] = useState<
    BinanceExchangeInfo | undefined
  >();

  const binance = useMemo<BinanceExchange>(() => {
    return new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
    });
  }, []);

  const selectedSymbols = useMemo<string[]>(() => {
    if (!exchangeInfo) return [];

    return extractBinanceSymbolsFromFlow({
      binanceSymbols: exchangeInfo.symbols,
      view,
    });
  }, [exchangeInfo, view]);

  useEffect(() => {
    const fetchExchangeInfo = async () => {
      try {
        const exchangeInfo = await binance.exchangeInfo();
        setExchangeInfo(exchangeInfo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExchangeInfo();
  }, [binance, setExchangeInfo]);

  const { startTime, endTime } = useMemo(() => {
    return {
      startTime: new Date(startDay).getTime(),
      endTime: new Date(maxDay).getTime(),
    };
  }, [startDay, maxDay]);

  return (
    <div>
      {selectedSymbols.length === 0 && (
        <div className="my-2 h-48">No symbol found in strategy below.</div>
      )}
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
    async function fetchKlines() {
      const interval = "1d";
      const klines = await binance.klines(symbol, interval, {
        startTime,
        endTime,
      });
      setKlines(klines);
    }
    fetchKlines();
  }, [binance, setKlines, startTime, endTime]);

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
