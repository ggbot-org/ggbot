import { isDay } from "@ggbot2/time";
import { Dflow, DflowObject } from "dflow";
import { AccountKey, isAccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { BalanceChangeEvent, isBalanceChangeEvent } from "./balance.js";
import { Item, ItemKey, isItemId } from "./item.js";
import type { Operation } from "./operation.js";
import type { StrategyKey } from "./strategy.js";
import type { DayKey, UpdateTime } from "./time.js";

export type Transaction = Item &
  BalanceChangeEvent & {
    /** Transaction detail. */
    info?: DflowObject;
  };

export const isTransaction = (arg: unknown): arg is Transaction => {
  if (typeof arg !== "object" || arg === null) return false;
  const { id, info, ...balanceChange } = arg as Partial<Transaction>;
  if (info && Dflow.isObject(info)) return false;
  return isItemId(id) && isBalanceChangeEvent(balanceChange);
};

export type TransactionKey = AccountStrategyKey &
  ItemKey<{
    transactionId: Transaction["id"];
  }>;

export const isTransactionKey = (arg: unknown): arg is TransactionKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { transactionId: id, ...key } = arg as Partial<TransactionKey>;
  return isItemId(id) && isAccountStrategyKey(key);
};

/** Daily transactions per strategy. */
export type StrategyDailyTransactionsKey = AccountStrategyKey & DayKey;

export const isStrategyDailyTransactionsKey = (
  arg: unknown
): arg is StrategyDailyTransactionsKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { day, ...key } = arg as Partial<StrategyDailyTransactionsKey>;
  return isDay(day) && isAccountStrategyKey(key);
};

export type ReadStrategyDailyTransactions = Operation<
  StrategyDailyTransactionsKey,
  Transaction[] | null
>;

export type WriteStrategyDailyTransactions = Operation<
  StrategyDailyTransactionsKey & Transaction[],
  UpdateTime
>;

export type StrategyTransactions = StrategyKey & {
  transactions: Transaction;
};

/** Daily transactions per account. */
export type AccountDailyTransactionsKey = AccountKey & DayKey;

export const isAccountDailyTransactionsKey = (
  arg: unknown
): arg is AccountDailyTransactionsKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { day, ...key } = arg as Partial<AccountDailyTransactionsKey>;
  return isDay(day) && isAccountKey(key);
};

export type ReadAccountDailyTransactions = Operation<
  AccountDailyTransactionsKey,
  StrategyTransactions[] | null
>;

export type WriteAccountDailyTransactions = Operation<
  StrategyDailyTransactionsKey & StrategyTransactions[],
  UpdateTime
>;
