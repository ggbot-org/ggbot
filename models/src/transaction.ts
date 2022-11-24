import type { DflowObject } from "dflow";
import type { AccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { BalanceChangeEvent, isBalanceChangeEvent } from "./balance.js";
import { Item, ItemKey, isItemId } from "./item.js";
import type { Operation } from "./operation.js";
import type { StrategyKey } from "./strategy.js";
import type { DayKey } from "./time.js";

export type Transaction = Item &
  BalanceChangeEvent & {
    /** Optional transaction detail. It may be omitted, according to context. */
    info?: DflowObject;
  };

export const isTransaction = (arg: unknown): arg is Transaction => {
  if (typeof arg !== "object" || arg === null) return false;
  const { id, ...balanceChange } = arg as Partial<Transaction>;
  return isBalanceChangeEvent(balanceChange) && isItemId(id);
};

export type TransactionKey = AccountStrategyKey &
  ItemKey<{
    transactionId: Transaction["id"];
  }>;

export const isTransactionKey = (arg: unknown): arg is TransactionKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { transactionId, ...accountStrategyKey } =
    arg as Partial<TransactionKey>;
  return isAccountStrategyKey(accountStrategyKey) && isItemId(transactionId);
};

export type CreateTransaction = Operation<TransactionKey, Transaction>;

export type ReadTransaction = Operation<TransactionKey, Transaction | null>;

export type StrategyDailyTransactionsKey = AccountStrategyKey & DayKey;

export type ReadStrategyDailyTransactions = Operation<
  StrategyDailyTransactionsKey,
  Transaction[] | null
>;

export type WriteStrategyDailyTransactions = Operation<
  StrategyDailyTransactionsKey,
  Transaction[]
>;

export type StrategyTransactions = StrategyKey & {
  transactions: Transaction;
};

export type AccountDailyTransactionsKey = AccountKey & DayKey;

export type ReadAccountDailyTransactions = Operation<
  AccountDailyTransactionsKey,
  StrategyTransactions[] | null
>;

export type WriteAccountDailyTransactions = Operation<
  StrategyDailyTransactionsKey,
  StrategyTransactions[]
>;
