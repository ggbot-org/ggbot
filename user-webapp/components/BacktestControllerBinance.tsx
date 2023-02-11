import { BinanceExchangeInfo } from "@ggbot2/binance";
import { extractBinanceSymbolsAndIntervalsFromFlow } from "@ggbot2/dflow";
import { dayIntervalToTime } from "@ggbot2/time";
import { Button } from "@ggbot2/ui-components";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { binance } from "_flow/binance";
import { BacktestingState, BacktestingDispatch } from "_hooks";
import { StrategyFlow } from "_routing";
import { BinanceKlinesChart } from "./BinanceKlinesChart";

type Props = Pick<StrategyFlow, "view"> & {
  state: BacktestingState;
  dispatch: BacktestingDispatch;
};

export const BacktestControllerBinance: FC<Props> = ({
  state: {
    dayInterval: { start: startDay },
    maxDay,
    isEnabled,
    isPaused,
    isRunning,
  },
  dispatch,
  view,
}) => {
  const [exchangeInfo, setExchangeInfo] = useState<BinanceExchangeInfo | undefined>();

  const actionLabel = useMemo(() => {
    if (isPaused) return "Resume";
    if (isRunning) return "Pause";
    if (isEnabled) return "Start";
  }, [isEnabled, isPaused, isRunning]);

  const onClickAction = useCallback(() => {
    if (isRunning) dispatch({ type: "PAUSE" });
    if (isPaused) dispatch({ type: "RESUME" });
    else if (isEnabled) dispatch({ type: "START" });
  }, [dispatch, isEnabled, isPaused, isRunning]);

  const symbolsAndIntervals = useMemo<
    ReturnType<typeof extractBinanceSymbolsAndIntervalsFromFlow> | undefined
  >(() => {
    if (!exchangeInfo) return;
    if (!view) return;

    return extractBinanceSymbolsAndIntervalsFromFlow(exchangeInfo.symbols, view);
  }, [exchangeInfo, view]);

  const fetchExchangeInfo = useCallback(async () => {
    const exchangeInfo = await binance.exchangeInfo();
    setExchangeInfo(exchangeInfo);
  }, []);

  useEffect(() => {
    fetchExchangeInfo();
  }, [fetchExchangeInfo]);

  const timeInterval = useMemo(
    () => dayIntervalToTime({ start: startDay, end: maxDay }),
    [startDay, maxDay]
  );

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
              timeInterval={timeInterval}
              interval={interval}
            />
          ))}
        </div>
      )}
      <menu>
        <Button onClick={onClickAction}>{actionLabel}</Button>
      </menu>
    </div>
  );
};
