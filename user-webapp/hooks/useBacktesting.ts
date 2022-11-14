import { add } from "@ggbot2/arithmetic";
import { BinanceDflowExecutor } from "@ggbot2/dflow";
import { Balance } from "@ggbot2/models";
import {
  Day,
  Timestamp,
  getDate,
  dateToDay,
  dateToTimestamp,
} from "@ggbot2/time";
import type { FlowViewSerializableGraph } from "flow-view";
import { Dispatch, useCallback, useEffect, useMemo, useReducer } from "react";
import { BinanceDflowClient } from "_flow/binance";
import { StrategyKey } from "_routing";
import { useIsServerSide } from "./useIsServerSide";
import { UseNodesCatalogArg, useNodesCatalog } from "./useNodesCatalog";

type State = StrategyKey & {
  balances: Balance[];
  isEnabled: boolean;
  isRunning: boolean;
  startDay: Day;
  endDay: Day;
  timestamps: Timestamp[];
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

const computeTimestamps = ({
  startDay,
  endDay,
}: Pick<State, "startDay" | "endDay">): State["timestamps"] => {
  const numMinutes = 60;
  const timestamps: Timestamp[] = [];
  let date = new Date(startDay);
  const endDate = getDate(new Date(endDay)).plus(1).days();
  while (date < endDate) {
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
      type: "SET_INTERVAL";
      startDay: Day;
      endDay: Day;
    }
  | {
      type: "START";
    }
  | {
      type: "TOGGLE";
    }
  | {
      type: "UPDATE_BALANCE";
      balances: Balance[];
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
        timestamps: computeTimestamps({ startDay, endDay }),
      };
    }

    case "START":
      return { ...state, isRunning: true };

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
        isRunning: false,
        maxDay,
        timestamps: computeTimestamps(persistingState),
        ...strategyKey,
      };
    }
    // Default state.
    const startDay = dateToDay(getDate(new Date(maxDay)).minus(7).days());
    const endDay = maxDay;
    return {
      balances: [],
      isEnabled: false,
      isRunning: false,
      startDay,
      endDay,
      timestamps: computeTimestamps({ startDay, endDay }),
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
    isEnabled,
    isRunning: backtestIsRunning,
    startDay,
    endDay,
    timestamps,
  } = state;

  const runBacktest = useCallback<(arg: { delay: number }) => void>(
    async ({ delay }) => {
      if (!nodesCatalog) return;
      if (!flowViewGraph) return;

      if (strategyKind === "binance") {
        if (!binanceSymbols) return;

        const executeStep = async (index = 0, memory = {}) => {
          const timestamp = timestamps[index];
          if (timestamp) {
            try {
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
                { memory, timestamp },
                flowViewGraph
              );
              if (result.balances.length > 0)
                dispatch({ type: "UPDATE_BALANCE", balances: result.balances });
              // TODO check memory nodes
              setTimeout(() => executeStep(index + 1, memory), delay);
            } catch (error) {
              console.error(error);
              dispatch({ type: "END" });
            }
          } else {
            dispatch({ type: "END" });
          }
        };

        executeStep();
      }
    },
    [binanceSymbols, dispatch, flowViewGraph, nodesCatalog, strategyKind]
  );

  useEffect(() => {
    if (backtestIsRunning) runBacktest({ delay: 2000 });
  }, [backtestIsRunning, runBacktest]);

  useEffect(() => {
    if (isServerSide) return;
    setPersistingState({ isEnabled, startDay, endDay });
  }, [isEnabled, startDay, endDay, isServerSide, setPersistingState]);

  return useMemo(
    () => [isServerSide ? undefined : state, dispatch],
    [isServerSide, dispatch, state]
  );
};
