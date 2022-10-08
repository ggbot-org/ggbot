import { Day, addDays, getDayFromDate, today } from "@ggbot2/time";
import {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { StrategyKey } from "_routing";

type State = StrategyKey & {
  isEnabled: boolean;
  isRunning: boolean;
  startDay: Day;
  maxDay: Day;
};
export type BacktestingState = State;

type PersistingState = Pick<State, "isEnabled" | "startDay">;

type GetPersistingState = () => PersistingState | undefined;
type SetPersistingState = (arg: PersistingState) => void;

const isPersistingState = (arg: unknown): arg is PersistingState => {
  if (!arg || typeof arg !== "object") return false;
  const { isEnabled } = arg as Partial<PersistingState>;
  return typeof isEnabled === "boolean";
};

type Action =
  | {
      type: "DISABLE";
    }
  | {
      type: "SET_START_DAY";
      day: Day;
    }
  | {
      type: "START";
    }
  | {
      type: "TOGGLE";
    };

export type BacktestingDispatch = Dispatch<Action>;

const backtestingReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "DISABLE":
      return { ...state, isEnabled: false };
    case "SET_START_DAY":
      return { ...state, startDay: action.day };
    case "START":
      return { ...state, isRunning: true };
    case "TOGGLE":
      return { ...state, isEnabled: !state.isEnabled };
    default:
      throw new Error();
  }
};

const getInitialState =
  (strategyKey: StrategyKey) =>
  (persistingState: PersistingState | undefined): State => {
    // Max is yesterday.
    const maxDay = getDayFromDate(addDays(-1, new Date())) as Day;
    if (persistingState) {
      return {
        ...persistingState,
        isRunning: false,
        maxDay,
        ...strategyKey,
      };
    }
    // Default state.
    const startDay = getDayFromDate(addDays(-7, new Date(maxDay))) as Day;
    return {
      isEnabled: false,
      isRunning: false,
      startDay,
      maxDay,
      ...strategyKey,
    };
  };

export const useBacktesting = (
  strategyKey: StrategyKey
): [state: State | undefined, dispatch: BacktestingDispatch] => {
  const [isServerSide, setIsServerSide] = useState(true);

  const storageKey = useMemo(
    () => `backtest:${strategyKey.strategyKind}:${strategyKey.strategyId}`,
    [strategyKey]
  );

  const getPersistingState = useCallback<GetPersistingState>(() => {
    try {
      const storedState = global?.window?.sessionStorage?.getItem(storageKey);
      if (!storedState) return;
      const persistingState = JSON.parse(storedState);
      if (isPersistingState(persistingState)) return persistingState;
    } catch (error) {
      console.error(error);
    }
  }, [storageKey]);

  const setPersistingState = useCallback<SetPersistingState>(
    (arg) => {
      try {
        global?.window?.sessionStorage?.setItem(
          storageKey,
          JSON.stringify(arg)
        );
      } catch (error) {
        console.error(error);
      }
    },
    [storageKey]
  );

  const [state, dispatch] = useReducer(
    backtestingReducer,
    getPersistingState(),
    getInitialState(strategyKey)
  );

  const { isEnabled, startDay } = state;

  useEffect(() => {
    if (isServerSide) return;
    setPersistingState({ isEnabled, startDay });
  }, [isEnabled, startDay, isServerSide, setPersistingState]);

  useEffect(() => {
    setIsServerSide(false);
  }, [setIsServerSide]);

  return useMemo(
    () => [isServerSide ? undefined : state, dispatch],
    [isServerSide, dispatch, state]
  );
};
