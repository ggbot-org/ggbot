import { add } from "@ggbot2/arithmetic";
import { BinanceDflowExecutor } from "@ggbot2/dflow";
import { Balance } from "@ggbot2/models";
import {
  Day,
  DayInterval,
  Timestamp,
  dateToDay,
  dateToTimestamp,
  dayIntervalToDate,
  getDate,
} from "@ggbot2/time";
import type { FlowViewSerializableGraph } from "flow-view";
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from "react";
import { BinanceDflowClient } from "_flow/binance";
import { StrategyKey } from "_routing";
import { useIsServerSide } from "./useIsServerSide";
import { UseNodesCatalogArg, useNodesCatalog } from "./useNodesCatalog";

type State = StrategyKey & {
  stepIndex: number;
  balances: Balance[];
  isEnabled: boolean;
  isRunning: boolean;
  dayInterval: DayInterval;
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

const computeTimestamps = (
  dayInterval: State["dayInterval"]
): State["timestamps"] => {
  const { start, end } = dayIntervalToDate(dayInterval);
  const numMinutes = 60;
  const timestamps: Timestamp[] = [];
  let date = start;
  while (date < end) {
    timestamps.push(dateToTimestamp(date));
    date = getDate(date).plus(numMinutes).minutes();
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
  | {
      type: "NEXT";
    }
  | ({
      type: "SET_INTERVAL";
    } & Pick<State, "dayInterval">)
  | {
      type: "START";
    }
  | {
      type: "TOGGLE";
    }
  | ({
      type: "UPDATE_BALANCE";
    } & Pick<State, "balances">);

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

    case "NEXT":
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };

    case "SET_INTERVAL": {
      if (state.isRunning) return state;
      const { dayInterval } = action;
      return {
        ...state,
        dayInterval,
        timestamps: computeTimestamps(dayInterval),
      };
    }

    case "START":
      return {
        ...state,
        isRunning: true,
        stepIndex: 0,
      };

    case "TOGGLE":
      return { ...state, isEnabled: !state.isEnabled };

    case "UPDATE_BALANCE":
      const balancesMap = new Map<Balance["asset"], Balance>();
      for (const balance of [...state.balances, ...action.balances]) {
        const currentBalance = balancesMap.get(balance.asset);
        if (currentBalance)
          balancesMap.set(balance.asset, {
            asset: balance.asset,
            free: add(balance.free, currentBalance.free),
            locked: add(balance.locked, currentBalance.locked),
          });
        else balancesMap.set(balance.asset, balance);
      }
      return { ...state, balances: [...balancesMap.values()] };

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
    const maxDay = dateToDay(getDate(new Date()).minus(1).days());
    // PersistingState:
    // startDay and endDay will always be lower than maxDay.
    if (persistingState) {
      return {
        ...persistingState,
        balances: [],
        stepIndex: 0,
        isRunning: false,
        maxDay,
        timestamps: computeTimestamps(persistingState.dayInterval),
        ...strategyKey,
      };
    }
    // Default state.
    const dayInterval = {
      start: dateToDay(getDate(new Date(maxDay)).minus(7).days()),
      end: maxDay,
    };
    return {
      balances: [],
      dayInterval,
      isEnabled: false,
      isRunning: false,
      stepIndex: 0,
      timestamps: computeTimestamps(dayInterval),
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
  const storage = global?.window?.sessionStorage;

  const isServerSide = useIsServerSide();

  const nodesCatalog = useNodesCatalog({ strategyKind, binanceSymbols });

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
    getInitialState({ strategyKind, strategyId })
  );

  const {
    dayInterval,
    isEnabled,
    isRunning: backtestIsRunning,
    stepIndex,
    timestamps,
  } = state;

  const runBacktest = useCallback(async () => {
    if (!nodesCatalog) return;
    if (!flowViewGraph) return;
    const timestamp = timestamps[stepIndex];
    if (!timestamp) return;

    if (strategyKind === "binance") {
      try {
        if (!binanceSymbols) return;
        const binance = new BinanceDflowClient({
          balances: [],
          timestamp,
        });
        const executor = new BinanceDflowExecutor(
          binance,
          binanceSymbols,
          nodesCatalog
        );
        const result = await executor.run(
          { memory: {}, timestamp },
          flowViewGraph
        );
        console.log(result);
        if (result.balances.length > 0)
          dispatch({ type: "UPDATE_BALANCE", balances: result.balances });
        // TODO check memory nodes
        dispatch({ type: "NEXT" });
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
    timestamps,
    strategyKind,
    stepIndex,
  ]);

  useEffect(() => {
    if (!backtestIsRunning) return;
    const delay = 2000;
    const timeoutId = setTimeout(runBacktest, delay);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [backtestIsRunning, runBacktest]);

  useEffect(() => {
    if (isServerSide) return;
    setPersistingState({ isEnabled, dayInterval });
  }, [isEnabled, dayInterval, isServerSide, setPersistingState]);

  return useMemo(
    () => [isServerSide ? undefined : state, dispatch],
    [isServerSide, dispatch, state]
  );
};
