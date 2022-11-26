import { Balance, isBalance } from "./balance.js";
import { CreationTime, isCreationTime } from "./time.js";

export type BalanceChangeEvent = CreationTime & {
  balances: Balance[];
};

export const isBalanceChangeEvent = (
  arg: unknown
): arg is BalanceChangeEvent => {
  if (typeof arg !== "object" || arg === null) return false;
  const { balances, ...creationTime } = arg as Partial<BalanceChangeEvent>;
  if (!isCreationTime(creationTime)) return false;
  return Array.isArray(balances) && balances.every((item) => isBalance(item));
};
