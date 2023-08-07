import {
  Box,
  Column,
  Columns,
  DailyInterval,
  DailyIntervalProps,
  Title,
} from "@ggbot2/design";
import { isFrequency } from "@ggbot2/models";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { BacktestingActions } from "../components/BacktestingActions.js";
import {
  BacktestingProgress,
  BacktestingProgressProps,
} from "../components/BacktestingProgress.js";
import {
  FrequencyInput,
  FrequencyInputProps,
} from "../components/FrequencyInput.js";
import { ProfitSummary } from "../components/ProfitSummary.js";
import { StrategyFlowContext } from "../contexts/StrategyFlow.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { Memory } from "./Memory.js";

export const Backtesting: FC = () => {
  const { formatMessage } = useIntl();

  const { flowViewGraph } = useContext(StrategyFlowContext);

  const {
    state: {
      currentTimestamp,
      dayInterval,
      frequency,
      isPaused,
      isPreparing,
      isReadOnly,
      isRunning,
      maxDay,
      memory,
      orders,
      stepIndex,
      timestamps,
    },
    dispatch,
    hasRequiredData,
  } = useBacktesting(flowViewGraph);

  const [frequencyArg, setFrequencyArg] =
    useState<FrequencyInputProps["frequency"]>(frequency);

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

  const progress: BacktestingProgressProps["progress"] = {
    value: stepIndex,
    max: timestamps.length,
  };

  const onClickStop = useCallback(() => {
    dispatch({ type: "STOP" });
  }, [dispatch]);

  const onClickStart = useCallback(() => {
    dispatch({ type: "PREPARE" });
  }, [dispatch]);

  const onClickPause = useCallback(() => {
    dispatch({ type: "PAUSE" });
  }, [dispatch]);

  const onClickResume = useCallback(() => {
    dispatch({ type: "RESUME" });
  }, [dispatch]);

  return (
    <>
      <Columns>
        <Column size="one-third">
          <Box>
            <Title>
              <FormattedMessage id="Backtesting.title" />
            </Title>

            <DailyInterval
              start={{
                day: dayInterval.start,
                label: formatMessage({ id: "DailyInterval.from" }),
                setDay: setStart,
              }}
              end={{
                day: dayInterval.end,
                label: formatMessage({ id: "DailyInterval.to" }),
                setDay: setEnd,
              }}
              max={maxDay}
            />

            <FrequencyInput
              frequency={frequencyArg}
              setFrequency={setFrequency}
            />

            <BacktestingActions
              hasRequiredData={hasRequiredData}
              isPaused={isPaused}
              isReadOnly={isReadOnly}
              isRunning={isRunning}
              onClickPause={onClickPause}
              onClickResume={onClickResume}
              onClickStart={onClickStart}
              onClickStop={onClickStop}
            />
          </Box>
        </Column>

        <Column size="one-third">
          <Memory memory={memory} />
        </Column>

        <Column>
          <BacktestingProgress
            dayInterval={dayInterval}
            hasRequiredData={hasRequiredData}
            isPreparing={isPreparing}
            progress={progress}
            currentTimestamp={currentTimestamp}
          />
        </Column>
      </Columns>

      <ProfitSummary orders={orders} dayInterval={dayInterval} />
    </>
  );
};
