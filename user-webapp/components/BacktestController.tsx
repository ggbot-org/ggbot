import { dayIntervalToTime } from "@ggbot2/time";
import { CalendarSetSelectedDay, DateTime } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import { BacktestingState, BacktestingDispatch } from "_hooks";
import { StrategyFlow } from "_routing";
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
    dayInterval,
    numSteps,
    stepIndex,
    strategyKind,
  } = useMemo(() => {
    if (!state)
      return {
        balanceHistory: [],
        currentTimestamp: undefined,
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
      stepIndex,
      strategyKind,
      timestamps,
    } = state;

    const currentTimestamp = timestamps[stepIndex];
    const numSteps = timestamps.length;

    return {
      balanceHistory,
      currentTimestamp,
      maxDay,
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

  if (!state || !state.isEnabled) return null;

  return (
    <div className="my-2">
      <DailyIntervalSelector
        max={maxDay}
        startDay={dayInterval?.start}
        setStartDay={setStartDay}
      />
      <div>
        <span>{`${stepIndex} of ${numSteps} intervals`}</span>
        <DateTime format="time" value={currentTimestamp} />
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
