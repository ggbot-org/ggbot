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
import { useCallback, useContext, useEffect, useReducer } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { BinanceDflowClient } from "../flow/binance.js";
import { useBinanceSymbols } from "../hooks/useBinanceSymbols.js";
import { useNodesCatalog } from "../hooks/useNodesCatalog.js";

type State = Pick<DflowCommonContext, "memory"> & {
  stepIndex: number;
  balanceHistory: BalanceChangeEvent[];
  frequency: Frequency;
  isRunning: boolean;
  isPaused: boolean;
  dayInterval: DayInterval;
  orders: Order[];
  timestamps: Timestamp[];
  maxDay: Day;
};

type Action =
  | {
      type: "END";
    }
  | {
      type: "NEXT";
      data: {
        balanceChangeEvent?: BalanceChangeEvent;
        orders: Order[];
      } & Pick<State, "memory">;
    }
  | {
      type: "PAUSE";
    }
  | {
      type: "RESUME";
    }
  | {
      type: "SET_FREQUENCY";
      data: Pick<State, "frequency">;
    }
  | {
      type: "SET_DAY_INTERVAL";
      data: Pick<State, "dayInterval">;
    }
  | {
      type: "START";
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
      const { balanceChangeEvent, memory, orders } = action.data;
      return {
        ...state,
        balanceHistory: balanceChangeEvent
          ? state.balanceHistory.concat(balanceChangeEvent)
          : state.balanceHistory,
        memory: memory,
        orders: state.orders.concat(orders),
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
      return state.isPaused
        ? {
            ...state,
            isPaused: false,
            isRunning: true,
          }
        : state;
    }

    case "SET_FREQUENCY": {
      if (state.isPaused || state.isRunning) return state;
      const { frequency } = action.data;
      return {
        ...state,
        frequency,
        timestamps: computeTimestamps({
          dayInterval: state.dayInterval,
          frequency,
        }),
      };
    }

    case "SET_DAY_INTERVAL": {
      if (state.isPaused || state.isRunning) return state;
      const { dayInterval } = action.data;
      return {
        ...state,
        dayInterval,
        timestamps: computeTimestamps({
          dayInterval,
          frequency: state.frequency,
        }),
      };
    }

    case "START": {
      return {
        ...state,
        balanceHistory: [],
        isPaused: false,
        isRunning: true,
        memory: {},
        orders: [],
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
    maxDay,
    memory: {},
    orders: [],
    stepIndex: 0,
    timestamps: computeTimestamps({ dayInterval, frequency }),
  };
};

export const useBacktesting = (
  flowViewGraph: FlowViewSerializableGraph | undefined
) => {
  const {
    strategy: { kind: strategyKind },
  } = useContext(StrategyContext);

  const binanceSymbols = useBinanceSymbols();
  const nodesCatalog = useNodesCatalog();

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
                balances,
                whenCreated: time,
              };
        dispatch({
          type: "NEXT",
          data: {
            balanceChangeEvent,
            memory,
            orders: orders.map(({ info }) => newOrder({ info })),
          },
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

  return { state, dispatch };
};
