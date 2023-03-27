import { Button, CalendarSetSelectedDay, DateTime } from "@ggbot2/design";
import { everyOneHour, isFrequency } from "@ggbot2/models";
import { dayIntervalToTime } from "@ggbot2/time";
import { FC, useCallback, useMemo, useState } from "react";
import { BacktestingState, BacktestingDispatch } from "_hooks";
import { backtestActionLabel } from "_i18n";
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
  const [frequencyArg, setFrequencyArg] = useState<
    FrequencyInputProps["frequency"]
  >(everyOneHour());

  const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>(
    (frequency) => {
      setFrequencyArg(frequency);
      if (isFrequency(frequency))
        dispatch({ type: "SET_FREQUENCY", frequency });
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
    currentTimestamp,
    isEnabled,
    isPaused,
    isRunning,
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
        currentTimestamp: undefined,
        isEnabled: false,
        isPaused: false,
        isRunning: false,
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
      dayInterval,
      isEnabled,
      isPaused,
      isRunning,
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
      currentTimestamp,
      isEnabled,
      isPaused,
      isRunning,
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

  let actionLabel = "";
  if (isPaused) actionLabel = backtestActionLabel.resume;
  if (isRunning) actionLabel = backtestActionLabel.pause;
  if (isEnabled) actionLabel = backtestActionLabel.start;

  const onClickAction = useCallback(() => {
    if (isRunning) dispatch({ type: "PAUSE" });
    if (isPaused) dispatch({ type: "RESUME" });
    else if (isEnabled) dispatch({ type: "START" });
  }, [dispatch, isEnabled, isPaused, isRunning]);

  return (
    <div>
      <DailyIntervalSelector
        max={maxDay}
        endDay={maxDay}
        startDay={dayInterval?.start}
        setStartDay={setStartDay}
      />

      <FrequencyInput frequency={frequencyArg} setFrequency={setFrequency} />

      <div>
        <div>
          <span>{`${stepIndex} of ${numSteps} intervals`}</span>
          <DateTime format="time" value={currentTimestamp} />
        </div>

        <div>
          <span>Memory</span>
          {memoryItems.length === 0 ? <span>(empty)</span> : null}
        </div>

        <div>
          {memoryItems.map(({ key, value }) => (
            <div key={key}>
              <span>{key}:</span>
              <pre>
                <code>{JSON.stringify(value, null, 2)}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <ProfitSummary
        orderHistory={orderHistory}
        timeInterval={timeInterval}
        strategyKind={strategyKind}
      />

      {strategyKind === "binance" && view && dayInterval && (
        <BacktestControllerBinance dayInterval={dayInterval} view={view} />
      )}

      <menu>
        <Button onClick={onClickAction}>{actionLabel}</Button>
      </menu>
    </div>
  );
};
