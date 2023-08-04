import {
  Box,
  Button,
  Buttons,
  Column,
  Columns,
  DailyInterval,
  DailyIntervalProps,
  DateTime,
  Progress,
  ProgressProps,
  Title,
} from "@ggbot2/design";
import { everyOneHour, isFrequency } from "@ggbot2/models";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      dayInterval,
      orders,
      maxDay,
      memory,
      isPaused,
      isRunning,
      stepIndex,
      timestamps,
    },
    dispatch,
    hasRequiredData,
  } = useBacktesting(flowViewGraph);

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

  const timestamp = timestamps[stepIndex];

  const progress: Pick<ProgressProps, "value" | "max"> | undefined =
    hasRequiredData
      ? {
          value: stepIndex,
          max: timestamps.length,
        }
      : undefined;

  const onClickStart = useCallback(() => {
    dispatch({ type: "START" });
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

            <FrequencyInput
              frequency={frequencyArg}
              setFrequency={setFrequency}
            />

            <Buttons>
              {hasRequiredData ? (
                isPaused ? (
                  <Button onClick={onClickPause}>
                    {formatMessage({ id: "Backtesting.resume" })}
                  </Button>
                ) : isRunning ? (
                  <Button onClick={onClickResume}>
                    {formatMessage({ id: "Backtesting.pause" })}
                  </Button>
                ) : (
                  <Button onClick={onClickStart}>
                    {formatMessage({ id: "Backtesting.start" })}
                  </Button>
                )
              ) : (
                <Button isLoading />
              )}
            </Buttons>
          </Box>
        </Column>

        <Column size="one-third">
          <Memory memory={memory} />
        </Column>

        <Column>
          <Box>
            <Title>
              <FormattedMessage id="Backtesting.progress" />
            </Title>

            {progress ? (
              <>
                <FormattedMessage
                  id="Backtesting.progressSummary"
                  values={progress}
                />

                <Progress {...progress} />
              </>
            ) : (
              <>
                <FormattedMessage id="Backtesting.waiting" values={progress} />

                <Progress value={undefined} />
              </>
            )}

            <DateTime format="time" value={timestamp} />
          </Box>
        </Column>
      </Columns>

      <ProfitSummary orders={orders} dayInterval={dayInterval} />
    </>
  );
};
