import { dayIntervalToTime } from "@ggbot2/time";
import { CalendarSetSelectedDay, DateTime } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import type { BacktestingState, BacktestingDispatch } from "_hooks";
import type { StrategyFlow } from "_routing";
import { BacktestControllerBinance } from "./BacktestControllerBinance";
import { DailyIntervalSelector } from "./DailyIntervalSelector";
import { ProfitSummary } from "./ProfitSummary";

type Props = Partial<Pick<StrategyFlow, "view">> & {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<Props> = ({ state, dispatch, view }) => {
  const setStartDay = useCallback<CalendarSetSelectedDay>(
    (day) => {
      const endDay = state?.dayInterval.end;
      if (!endDay) return;
      dispatch({
        type: "SET_INTERVAL",
        dayInterval: { start: day, end: endDay },
      });
    },
    [dispatch, state?.dayInterval.end]
  );

  const {
    balanceHistory,
    currentTimestamp,
    maxDay,
    memoryItems,
    dayInterval,
    numSteps,
    stepIndex,
    strategyKind,
  } = useMemo(() => {
    if (!state)
      return {
        balanceHistory: [],
        currentTimestamp: undefined,
        memoryItems: [],
        noMemory: true,
        maxDay: undefined,
        dayInterval: undefined,
        numSteps: undefined,
        stepIndex: undefined,
        strategyKind: undefined,
      };
    const {
      balanceHistory,
      dayInterval,
      maxDay,
      memory,
      stepIndex,
      strategyKind,
      timestamps,
    } = state;

    const currentTimestamp = timestamps[stepIndex];
    const numSteps = timestamps.length;

    const memoryItems = Object.entries(memory).map(([key, value]) => ({
      key,
      value,
    }));

    return {
      balanceHistory,
      currentTimestamp,
      maxDay,
      memoryItems,
      dayInterval,
      numSteps,
      stepIndex,
      strategyKind,
    };
  }, [state]);

  const timeInterval = useMemo(
    () => (dayInterval ? dayIntervalToTime(dayInterval) : undefined),
    [dayInterval]
  );

  console.log(balanceHistory);

  if (!state || !state.isEnabled) return null;

  return (
    <div className="my-2 flex flex-col gap-2">
      <DailyIntervalSelector
        max={maxDay}
        startDay={dayInterval?.start}
        setStartDay={setStartDay}
      />
      <div>
        <span>{`${stepIndex} of ${numSteps} intervals`}</span>
        <DateTime format="time" value={currentTimestamp} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-1">
          <span>Memory</span>
          {memoryItems.length === 0 ? <span>(empty)</span> : null}
        </div>
        <div>
          {memoryItems.map(({ key, value }) => (
            <div key={key} className="flex flex-row gap-1">
              <span>{key}:</span>
              <pre>
                <code>{JSON.stringify(value, null, 2)}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <ProfitSummary
        balanceHistory={balanceHistory}
        timeInterval={timeInterval}
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
