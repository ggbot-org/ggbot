import { Balances, isBalances } from "./balance.js";
import { objectTypeGuard } from "./objects.js";
import { CreationTime, isCreationTime } from "./time.js";

export type BalanceChangeEvent = CreationTime & {
  balances: Balances;
};

export const isBalanceChangeEvent = objectTypeGuard<BalanceChangeEvent>(
  ({ balances, ...creationTime }) =>
    isCreationTime(creationTime) && isBalances(balances)
);
