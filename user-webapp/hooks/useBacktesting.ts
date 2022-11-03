import {
  ErrorInvalidTimestamp,
  Day,
  Timestamp,
  addMinutes,
  addDays,
  getDayFromDate,
  getTimestampFromDate,
  isTimestamp,
  getDayFromTimestamp,
} from "@ggbot2/time";
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from "react";
import { StrategyKey } from "_routing";
import { useIsServerSide } from "./useIsServerSide";

type State = StrategyKey & {
  isEnabled: boolean;
  isRunning: boolean;
  startDay: Day;
  endDay: Day;
  maxDay: Day;
};
export type BacktestingState = State;

type PersistingState = Pick<State, "isEnabled" | "startDay" | "endDay">;

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
      type: "END";
    }
  | {
      type: "SET_INTERVAL";
      startDay: Day;
      endDay: Day;
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
    case "END":
      return {
        ...state,
        isRunning: false,
      };
    case "SET_INTERVAL": {
      if (state.isRunning) return state;
      const { startDay, endDay } = action;
      return {
        ...state,
        startDay,
        endDay,
      };
    }
    case "START":
      return { ...state, isRunning: true };
    case "TOGGLE":
      return { ...state, isEnabled: !state.isEnabled };
    default:
      return state;
  }
};

/**
Generate SHA-256 from string.

Credits: https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/

TODO use this function to generate hash of strategy
to know if strategy changed
const sha256 = async (arg: string) => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(arg)
  );
  return Array.from(new Uint8Array(buffer))
    .map((element) => element.toString(16))
    .join("");
};
*/

const getInitialState =
  (strategyKey: StrategyKey) =>
  (persistingState: PersistingState | undefined): State => {
    // Max is yesterday.
    const maxDay = getDayFromDate(addDays(-1, new Date()));
    // PersistingState:
    // startDay and endDay will always be lower than maxDay.
    if (persistingState) {
      return {
        ...persistingState,
        isRunning: false,
        maxDay,
        ...strategyKey,
      };
    }
    // Default state.
    const startDay = getDayFromDate(addDays(-7, new Date(maxDay)));
    return {
      isEnabled: false,
      isRunning: false,
      startDay,
      endDay: maxDay,
      maxDay,
      ...strategyKey,
    };
  };

export const useBacktesting = (
  strategyKey: StrategyKey
): [state: State | undefined, dispatch: BacktestingDispatch] => {
  const storage = global?.window?.sessionStorage;

  const { strategyKind, strategyId } = strategyKey;

  const isServerSide = useIsServerSide();

  const storageKey = useMemo(
    () => `backtest:${strategyKind}:${strategyId}`,
    [strategyKind, strategyId]
  );

  const getPersistingState = useCallback<GetPersistingState>(() => {
    try {
      if (!storage) return;
      const storedState = storage.getItem(storageKey);
      if (!storedState) return;
      const persistingState = JSON.parse(storedState);
      if (isPersistingState(persistingState)) return persistingState;
    } catch (error) {
      console.error(error);
    }
  }, [storage, storageKey]);

  const setPersistingState = useCallback<SetPersistingState>(
    (arg) => {
      try {
        if (!storage) return;
        storage.setItem(storageKey, JSON.stringify(arg));
      } catch (error) {
        console.error(error);
      }
    },
    [storage, storageKey]
  );

  const [state, dispatch] = useReducer(
    backtestingReducer,
    getPersistingState(),
    getInitialState(strategyKey)
  );

  const { isEnabled, isRunning, startDay, endDay } = state;

  const run = useCallback(async () => {
    if (!isRunning) return;

    const numMinutes = 60;
    const startDate = new Date(startDay);
    const timestamps: Timestamp[] = [getTimestampFromDate(startDate)];

    const getLastTimestamp = () => {
      const lastTimestamp = timestamps.slice(-1).pop();
      if (!isTimestamp(lastTimestamp)) throw new ErrorInvalidTimestamp();
      return lastTimestamp;
    };

    const getNextDate = () => {
      const lastTimestamp = getLastTimestamp();
      const lastDate = new Date(lastTimestamp);
      const nextDate = addMinutes(numMinutes, lastDate);
      return nextDate;
    };

    const getLastDay = () => {
      const lastTimestamp = getLastTimestamp();
      return getDayFromTimestamp(lastTimestamp);
    };

    while (getLastDay() < endDay) {
      const nextDate = getNextDate();
      timestamps.push(getTimestampFromDate(nextDate));
    }

    for (const timestamp of timestamps) {
      console.log(timestamp);
    }
  }, [dispatch, isRunning, endDay]);

  useEffect(() => {
    if (isRunning) run();
  }, [isRunning]);

  useEffect(() => {
    if (isServerSide) return;
    setPersistingState({ isEnabled, startDay, endDay });
  }, [isEnabled, startDay, endDay, isServerSide, setPersistingState]);

  return useMemo(
    () => [isServerSide ? undefined : state, dispatch],
    [isServerSide, dispatch, state]
  );
};
