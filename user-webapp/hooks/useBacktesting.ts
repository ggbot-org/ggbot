// TODO use markers to show sell and buy
// https://jsfiddle.net/TradingView/nd80cx1a/
import { BinanceDflowExecutor, DflowCommonContext } from "@ggbot2/dflow";
import { useIsServerSide } from "@ggbot2/hooks";
import {
  BalanceChangeEvent,
  Frequency,
  frequencyIntervalDuration,
  newOrder,
  everyOneHour,
  Order,
} from "@ggbot2/models";
import {
  Day,
  DayInterval,
  Timestamp,
  dateToDay,
  dateToTimestamp,
  dayIntervalToDate,
  getDate,
  timestampToTime,
} from "@ggbot2/time";
import { FlowViewSerializableGraph } from "flow-view";
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from "react";
import { BinanceDflowClient } from "_flow/binance";
import { StrategyKey } from "_routing";
import { UseNodesCatalogArg, useNodesCatalog } from "./useNodesCatalog";

type State = StrategyKey &
  Pick<DflowCommonContext, "memory"> & {
    stepIndex: number;
    balanceHistory: BalanceChangeEvent[];
    frequency: Frequency;
    isEnabled: boolean;
    isRunning: boolean;
    isPaused: boolean;
    dayInterval: DayInterval;
    orderHistory: Order[];
    timestamps: Timestamp[];
    maxDay: Day;
  };
export type BacktestingState = State;

type PersistingState = Pick<State, "isEnabled" | "dayInterval">;

type GetPersistingState = () => PersistingState | undefined;
type SetPersistingState = (arg: PersistingState) => void;

const isPersistingState = (arg: unknown): arg is PersistingState => {
  if (!arg || typeof arg !== "object") return false;
  const { isEnabled } = arg as Partial<PersistingState>;
  return typeof isEnabled === "boolean";
};

const computeTimestamps = ({
  dayInterval,
  frequency,
}: Pick<State, "dayInterval" | "frequency">): State["timestamps"] => {
  const { start, end } = dayIntervalToDate(dayInterval);
  const interval = frequencyIntervalDuration(frequency);
  const timestamps: Timestamp[] = [];
  let date = start;
  while (date < end) {
    timestamps.push(dateToTimestamp(date));
    date = new Date(date.getTime() + interval);
  }
  return timestamps;
};

type Action =
  | {
      type: "DISABLE";
    }
  | {
      type: "END";
    }
  | ({
      type: "NEXT";
      balanceChangeEvent?: BalanceChangeEvent;
      orders: Order[];
    } & Pick<State, "memory">)
  | {
      type: "PAUSE";
    }
  | {
      type: "RESUME";
    }
  | ({
      type: "SET_FREQUENCY";
    } & Pick<State, "frequency">)
  | ({
      type: "SET_INTERVAL";
    } & Pick<State, "dayInterval">)
  | {
      type: "START";
    }
  | {
      type: "TOGGLE";
    };

export type BacktestingDispatch = Dispatch<Action>;

const backtestingReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "DISABLE": {
      const { isRunning } = state;
      return {
        ...state,
        isEnabled: false,
        isRunning: false,
        isPaused: isRunning,
      };
    }

    case "END": {
      return {
        ...state,
        isPaused: false,
        isRunning: false,
      };
    }

    case "NEXT": {
      const { balanceHistory, orderHistory } = state;
      const { balanceChangeEvent, memory, orders } = action;
      return {
        ...state,
        balanceHistory: balanceChangeEvent ? balanceHistory.concat(balanceChangeEvent) : balanceHistory,
        memory,
        orderHistory: orderHistory.concat(orders),
        stepIndex: state.stepIndex + 1,
      };
    }

    case "PAUSE": {
      return {
        ...state,
        isPaused: true,
        isRunning: false,
      };
    }

    case "RESUME": {
      const { isPaused } = state;
      return isPaused
        ? {
            ...state,
            isPaused: false,
            isRunning: true,
          }
        : state;
    }

    case "SET_FREQUENCY": {
      const { isPaused, isRunning, dayInterval } = state;
      if (isPaused || isRunning) return state;
      const { frequency } = action;
      return {
        ...state,
        frequency,
        timestamps: computeTimestamps({ dayInterval, frequency }),
      };
    }

    case "SET_INTERVAL": {
      const { frequency, isPaused, isRunning } = state;
      if (isPaused || isRunning) return state;
      const { dayInterval } = action;
      return {
        ...state,
        dayInterval,
        timestamps: computeTimestamps({ dayInterval, frequency }),
      };
    }

    case "START": {
      const { isEnabled, isPaused } = state;
      if (!isEnabled || isPaused) return state;
      return {
        ...state,
        balanceHistory: [],
        isPaused: false,
        isRunning: true,
        memory: {},
        orderHistory: [],
        stepIndex: 0,
      };
    }

    case "TOGGLE": {
      const { isEnabled } = state;
      return isEnabled
        ? { ...state, isEnabled: false, isRunning: false, isPaused: true }
        : { ...state, isEnabled: true };
    }

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
    const frequency = everyOneHour();
    // Max is yesterday.
    const maxDay = dateToDay(getDate(new Date()).minus(1).days());
    const dayInterval = {
      start: dateToDay(getDate(new Date(maxDay)).minus(7).days()),
      end: maxDay,
    };
    // PersistingState:
    // startDay and endDay will always be lower than maxDay.
    if (persistingState) {
      return {
        ...persistingState,
        balanceHistory: [],
        frequency,
        isPaused: false,
        isRunning: false,
        maxDay,
        memory: {},
        orderHistory: [],
        stepIndex: 0,
        timestamps: computeTimestamps({ dayInterval: persistingState.dayInterval, frequency }),
        ...strategyKey,
      };
    }
    // Default state.
    return {
      balanceHistory: [],
      dayInterval,
      frequency,
      isEnabled: false,
      isPaused: false,
      isRunning: false,
      memory: {},
      orderHistory: [],
      stepIndex: 0,
      timestamps: computeTimestamps({ dayInterval, frequency }),
      maxDay,
      ...strategyKey,
    };
  };

type UseBacktesting = (
  arg: StrategyKey &
    Pick<UseNodesCatalogArg, "binanceSymbols"> & {
      flowViewGraph?: FlowViewSerializableGraph;
    }
) => [state: State | undefined, dispatch: BacktestingDispatch];

export const useBacktesting: UseBacktesting = ({
  binanceSymbols,
  flowViewGraph,
  strategyKind,
  strategyId,
}) => {
  const isServerSide = useIsServerSide();

  const nodesCatalog = useNodesCatalog({ strategyKind, binanceSymbols });

  const storageKey = useMemo(() => `backtest:${strategyKind}:${strategyId}`, [strategyKind, strategyId]);

  const getPersistingState = useCallback<GetPersistingState>(() => {
    try {
      if (isServerSide) return;
      const storedState = sessionStorage.getItem(storageKey);
      if (!storedState) return;
      const persistingState = JSON.parse(storedState);
      if (isPersistingState(persistingState)) return persistingState;
    } catch (error) {
      console.error(error);
    }
  }, [isServerSide, storageKey]);

  const setPersistingState = useCallback<SetPersistingState>(
    (arg) => {
      try {
        if (isServerSide) return;
        sessionStorage.setItem(storageKey, JSON.stringify(arg));
      } catch (error) {
        console.error(error);
      }
    },
    [isServerSide, storageKey]
  );

  const [state, dispatch] = useReducer(
    backtestingReducer,
    getPersistingState(),
    getInitialState({ strategyKind, strategyId })
  );

  const {
    dayInterval,
    isEnabled,
    isRunning: backtestIsRunning,
    memory: previousMemory,
    stepIndex,
    timestamps,
  } = state;

  const runBacktest = useCallback(async () => {
    if (!nodesCatalog) return;
    if (!flowViewGraph) return;
    const timestamp = timestamps[stepIndex];
    if (!timestamp) {
      dispatch({ type: "END" });
      return;
    }
    const time = timestampToTime(timestamp);

    if (strategyKind === "binance") {
      try {
        if (!binanceSymbols) return;
        const binance = new BinanceDflowClient({
          balances: [],
          time,
        });
        const executor = new BinanceDflowExecutor(binance, binanceSymbols, nodesCatalog);
        const { balances, memory, orders } = await executor.run(
          { input: {}, memory: previousMemory, time },
          flowViewGraph
        );
        const balanceChangeEvent =
          balances.length === 0
            ? undefined
            : {
                whenCreated: time,
                balances,
              };
        dispatch({
          type: "NEXT",
          balanceChangeEvent,
          memory,
          orders: orders.map(({ info }) => newOrder({ info })),
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "END" });
      }
    }
  }, [binanceSymbols, dispatch, flowViewGraph, nodesCatalog, timestamps, strategyKind, stepIndex]);

  useEffect(() => {
    if (!backtestIsRunning) return;
    runBacktest();
  }, [backtestIsRunning, runBacktest]);

  useEffect(() => {
    if (isServerSide) return;
    setPersistingState({ isEnabled, dayInterval });
  }, [isEnabled, dayInterval, isServerSide, setPersistingState]);

  return useMemo(() => [isServerSide ? undefined : state, dispatch], [isServerSide, dispatch, state]);
};
