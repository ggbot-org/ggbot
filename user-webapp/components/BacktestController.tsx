import { Calendar, CalendarSetSelectedDay } from "@ggbot2/ui-components";
import { FC, useCallback } from "react";
import { BacktestingState, BacktestingDispatch } from "_hooks";

type Props = {
  state: BacktestingState | undefined;
  dispatch: BacktestingDispatch;
};

export const BacktestController: FC<Props> = ({ state, dispatch }) => {
  if (!state || !state.isEnabled) return null;

  const { startDay } = state;

  const setStartDay = useCallback<CalendarSetSelectedDay>(
    (day) => {
      dispatch({ type: "SET_START_DAY", day });
    },
    [dispatch]
  );

  return (
    <div className="my-2">
      <Calendar selectedDay={startDay} setSelectedDay={setStartDay} />
    </div>
  );
};
