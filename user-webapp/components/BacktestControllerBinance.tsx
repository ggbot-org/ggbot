import { BinanceExchangeInfo } from "@ggbot2/binance";
import { extractBinanceSymbolsAndIntervalsFromFlow } from "@ggbot2/dflow";
import { TimeInterval, dayIntervalToTime } from "@ggbot2/time";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BinanceKlinesChart } from "_components/BinanceKlinesChart";
import { binance } from "_flow/binance";
import { BacktestingState } from "_hooks/useBacktesting";
import { StrategyFlow } from "_routing/types";

type Props = Pick<StrategyFlow, "view"> & Pick<BacktestingState, "dayInterval">;

export const BacktestControllerBinance: FC<Props> = ({ dayInterval, view }) => {
  const [exchangeInfo, setExchangeInfo] = useState<
    BinanceExchangeInfo | undefined
  >();

  const symbolsAndIntervals = useMemo<
    ReturnType<typeof extractBinanceSymbolsAndIntervalsFromFlow> | undefined
  >(() => {
    if (!exchangeInfo) return;
    if (!view) return;

    return extractBinanceSymbolsAndIntervalsFromFlow(
      exchangeInfo.symbols,
      view
    );
  }, [exchangeInfo, view]);

  const timeInterval = useMemo<TimeInterval>(
    () => dayIntervalToTime(dayInterval),
    [dayInterval]
  );

  const fetchExchangeInfo = useCallback(async () => {
    const exchangeInfo = await binance.exchangeInfo();
    setExchangeInfo(exchangeInfo);
  }, []);

  useEffect(() => {
    fetchExchangeInfo();
  }, [fetchExchangeInfo]);

  if (!Array.isArray(symbolsAndIntervals)) return null;

  return (
    <div>
      {symbolsAndIntervals.length === 0 ? (
        <div className="my-2 h-48 flex flex-col justify-center">
          <span>No symbol found in strategy flow.</span>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap justify-start gap-2">
          {symbolsAndIntervals.map(({ symbol, interval }) => (
            <BinanceKlinesChart
              key={symbol}
              binance={binance}
              symbol={symbol}
              interval={interval}
              {...timeInterval}
            />
          ))}
        </div>
      )}
    </div>
  );
};
