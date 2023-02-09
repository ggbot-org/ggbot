import { everyOneHour, isFrequency } from "@ggbot2/models";
import { dayIntervalToTime } from "@ggbot2/time";
import { CalendarSetSelectedDay, DateTime } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import { BacktestingState, BacktestingDispatch } from "_hooks";
import { StrategyFlow } from "_routing";
import { BacktestControllerBinance } from "./BacktestControllerBinance";
import { DailyIntervalSelector } from "./DailyIntervalSelector";
import { FrequencyInput, FrequencyInputProps } from "./FrequencyInput";
import { ProfitSummary } from "./ProfitSummary";

type Props = Partial<Pick<StrategyFlow, "view">> & {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<Props> = ({ state, dispatch, view }) => {
  const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>(
    (frequency) => {
      if (isFrequency(frequency)) dispatch({ type: "SET_FREQUENCY", frequency });
    },
    [dispatch]
  );

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
    frequency,
    maxDay,
    memoryItems,
    dayInterval,
    numSteps,
    orderHistory,
    stepIndex,
    strategyKind,
  } = useMemo(() => {
    if (!state)
      return {
        balanceHistory: [],
        currentTimestamp: undefined,
        frequency: everyOneHour(),
        memoryItems: [],
        noMemory: true,
        maxDay: undefined,
        dayInterval: undefined,
        numSteps: undefined,
        orderHistory: [],
        stepIndex: undefined,
        strategyKind: undefined,
      };
    const {
      balanceHistory,
      dayInterval,
      frequency,
      maxDay,
      memory,
      orderHistory,
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
      frequency,
      maxDay,
      memoryItems,
      dayInterval,
      numSteps,
      orderHistory,
      stepIndex,
      strategyKind,
    };
  }, [state]);

  const timeInterval = useMemo(
    () => (dayInterval ? dayIntervalToTime(dayInterval) : undefined),
    [dayInterval]
  );

  if (!state || !state.isEnabled) return null;

  return (
    <div className="my-2 flex flex-col gap-2">
      <DailyIntervalSelector
        max={maxDay}
        endDay={maxDay}
        startDay={dayInterval?.start}
        setStartDay={setStartDay}
      />

      <FrequencyInput frequency={frequency} setFrequency={setFrequency} />

      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <span>{`${stepIndex} of ${numSteps} intervals`}</span>
          <DateTime format="time" value={currentTimestamp} />
        </div>

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
        orderHistory={orderHistory}
        timeInterval={timeInterval}
        strategyKind={strategyKind}
      />

      {strategyKind === "binance" && view && state && (
        <BacktestControllerBinance state={state} dispatch={dispatch} view={view} />
      )}
    </div>
  );
};
