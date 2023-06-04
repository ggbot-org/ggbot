import { Button, CalendarSetSelectedDay, DateTime } from "@ggbot2/design";
import { everyOneHour, isFrequency } from "@ggbot2/models";
import { dayIntervalToTime } from "@ggbot2/time";
import { FC, useCallback, useMemo, useState } from "react";

import {
  BacktestingDispatch,
  BacktestingState,
} from "../hooks/useBacktesting.js";
import { backtestActionLabel } from "../i18n/index.js";
import { DailyIntervalSelector } from "./DailyIntervalSelector.js";
import { FrequencyInput, FrequencyInputProps } from "./FrequencyInput.js";
import { ProfitSummary } from "./ProfitSummary.js";

type Props = {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<Props> = ({ state, dispatch }) => {
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

  const timeInterval = dayInterval ? dayIntervalToTime(dayInterval) : undefined;

  let actionLabel = "";
  if (isPaused) {
    actionLabel = backtestActionLabel.resume;
  } else if (isRunning) {
    actionLabel = backtestActionLabel.pause;
  } else {
    actionLabel = backtestActionLabel.start;
  }

  const onClickAction = useCallback(() => {
    if (isRunning) dispatch({ type: "PAUSE" });
    else if (isPaused) dispatch({ type: "RESUME" });
    else dispatch({ type: "START" });
  }, [dispatch, isPaused, isRunning]);

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

      <menu>
        <Button onClick={onClickAction}>{actionLabel}</Button>
      </menu>
    </div>
  );
};
