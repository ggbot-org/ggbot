import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Balances, isBalances } from "./balance.js";
import { CreationTime, isCreationTime } from "./time.js";

export type BalanceChangeEvent = CreationTime & {
  balances: Balances;
};

export const isBalanceChangeEvent = objectTypeGuard<BalanceChangeEvent>(
  ({ balances, ...creationTime }) =>
    isCreationTime(creationTime) && isBalances(balances)
);

export type BalanceChangeEvents = BalanceChangeEvent[];

export const isBalanceChangeEvents =
  arrayTypeGuard<BalanceChangeEvent>(isBalanceChangeEvent);
