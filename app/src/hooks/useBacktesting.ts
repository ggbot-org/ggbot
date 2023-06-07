// TODO use markers to show sell and buy
// https://jsfiddle.net/TradingView/nd80cx1a/
import { BinanceDflowExecutor, DflowCommonContext } from "@ggbot2/dflow";
import {
  BalanceChangeEvent,
  everyOneHour,
  Frequency,
  frequencyIntervalDuration,
  newOrder,
  Order,
} from "@ggbot2/models";
import {
  dateToDay,
  dateToTimestamp,
  Day,
  DayInterval,
  dayIntervalToDate,
  getDate,
  Timestamp,
  timestampToTime,
} from "@ggbot2/time";
import { FlowViewSerializableGraph } from "flow-view";
import { Dispatch, useCallback, useEffect, useReducer } from "react";

import { BinanceDflowClient } from "../flow/binance.js";
import { useBinanceSymbols } from "./useBinanceSymbols.js";
import { useNodesCatalog, UseNodesCatalogArg } from "./useNodesCatalog.js";

type State = Pick<DflowCommonContext, "memory"> & {
  stepIndex: number;
  balanceHistory: BalanceChangeEvent[];
  frequency: Frequency;
  isRunning: boolean;
  isPaused: boolean;
  dayInterval: DayInterval;
  orderHistory: Order[];
  timestamps: Timestamp[];
  maxDay: Day;
};
export type BacktestingState = State;

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
    };

export type BacktestingDispatch = Dispatch<Action>;

const backtestingReducer = (state: State, action: Action) => {
  switch (action.type) {
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
        balanceHistory: balanceChangeEvent
          ? balanceHistory.concat(balanceChangeEvent)
          : balanceHistory,
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

    default:
      return state;
  }
};

// Generate SHA-256 from string.
//
// Credits:
// https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/
//
// TODO use this function to generate hash of strategy to know if strategy
// changed const sha256 = async (arg: string) => { const buffer = await
// crypto.subtle.digest( "SHA-256", new TextEncoder().encode(arg) ); return
// Array.from(new Uint8Array(buffer)) .map((element) => element.toString(16))
// .join(""); };

const getInitialState = (): State => {
  const frequency = everyOneHour();
  // Max is yesterday.
  const maxDay = dateToDay(getDate(new Date()).minus(1).days());
  const dayInterval = {
    start: dateToDay(getDate(new Date(maxDay)).minus(7).days()),
    end: maxDay,
  };
  return {
    balanceHistory: [],
    dayInterval,
    frequency,
    isPaused: false,
    isRunning: false,
    memory: {},
    orderHistory: [],
    stepIndex: 0,
    timestamps: computeTimestamps({ dayInterval, frequency }),
    maxDay,
  };
};

type UseBacktesting = (
  arg: UseNodesCatalogArg & {
    flowViewGraph?: FlowViewSerializableGraph;
  }
) => [state: State | undefined, dispatch: BacktestingDispatch];

export const useBacktesting: UseBacktesting = ({
  flowViewGraph,
  strategyKind,
}) => {
  const binanceSymbols = useBinanceSymbols({ strategyKind });
  const nodesCatalog = useNodesCatalog({ strategyKind });

  const [state, dispatch] = useReducer(backtestingReducer, getInitialState());

  const {
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
        const executor = new BinanceDflowExecutor(
          binance,
          binanceSymbols,
          nodesCatalog
        );
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
  }, [
    binanceSymbols,
    dispatch,
    flowViewGraph,
    nodesCatalog,
    previousMemory,
    stepIndex,
    strategyKind,
    timestamps,
  ]);

  useEffect(() => {
    if (!backtestIsRunning) return;
    runBacktest();
  }, [backtestIsRunning, runBacktest]);

  return [state, dispatch];
};
