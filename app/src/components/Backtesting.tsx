import {
  Button,
  Buttons,
  DailyInterval,
  DailyIntervalProps,
  DateTime,
  Section,
} from "@ggbot2/design";
import { everyOneHour, isFrequency } from "@ggbot2/models";
import { FC, useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import {
  FrequencyInput,
  FrequencyInputProps,
} from "../components/FrequencyInput.js";
import { ProfitSummary } from "../components/ProfitSummary.js";
import { UseBacktesting } from "../hooks/useBacktesting.js";
import { backtestActionLabel } from "../i18n/index.js";

type Props = ReturnType<UseBacktesting>;

export const Backtesting: FC<Props> = ({ state, dispatch }) => {
  const { formatMessage } = useIntl();

  const { dayInterval, maxDay } = state;

  const [frequencyArg, setFrequencyArg] = useState<
    FrequencyInputProps["frequency"]
  >(everyOneHour());

  const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>(
    (frequency) => {
      setFrequencyArg(frequency);
      if (isFrequency(frequency))
        dispatch({ type: "SET_FREQUENCY", data: { frequency } });
    },
    [dispatch]
  );

  const setEnd = useCallback<DailyIntervalProps["end"]["setDay"]>(
    (day) => {
      dispatch({
        type: "SET_DAY_INTERVAL",
        data: {
          dayInterval: { start: dayInterval.start, end: day },
        },
      });
    },
    [dispatch, dayInterval]
  );

  const setStart = useCallback<DailyIntervalProps["start"]["setDay"]>(
    (day) => {
      dispatch({
        type: "SET_DAY_INTERVAL",
        data: {
          dayInterval: { start: day, end: dayInterval.end },
        },
      });
    },
    [dispatch, dayInterval]
  );

  const {
    currentTimestamp,
    isPaused,
    isRunning,
    memoryItems,
    numSteps,
    orders,
    stepIndex,
  } = useMemo(() => {
    if (!state)
      return {
        currentTimestamp: undefined,
        isPaused: false,
        isRunning: false,
        memoryItems: [],
        noMemory: true,
        numSteps: undefined,
        orders: [],
        stepIndex: undefined,
      };
    const { isPaused, isRunning, memory, orders, stepIndex, timestamps } =
      state;

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
      memoryItems,
      numSteps,
      orders,
      stepIndex,
    };
  }, [state]);

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
    <>
      <Section>
        <DailyInterval
          start={{
            day: dayInterval.start,
            label: formatMessage({ id: "DailyInterval.labelStart" }),
            setDay: setStart,
          }}
          end={{
            day: dayInterval.end,
            label: formatMessage({ id: "DailyInterval.labelEnd" }),
            setDay: setEnd,
          }}
          max={maxDay}
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

        <Buttons>
          <Button onClick={onClickAction}>{actionLabel}</Button>
        </Buttons>
      </Section>

      <Section>
        <ProfitSummary orders={orders} dayInterval={dayInterval} />
      </Section>
    </>
  );
};
