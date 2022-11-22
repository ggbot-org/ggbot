import { Timestamp, isTimestamp } from "@ggbot2/time";

/**
A Balance is an abstract representation of an asset owned.

Values can be negative, for example a simulation could start with an empty list of balances.
@example
```typescript
const wallet: Balance[] = [];
```
Then after buying BTC for a worth of 1000 BUSD we have the following balances.
@example
```json
[
  {
    "asset": "BTC",
    "free": "0.01000000",
    "locked": "0"
  },
  {
    "asset": "BUSD",
    "free": "-1000.00",
    "locked": "0"
  }
]
```
*/
export type Balance = {
  /** Asset symbol, e.g. BTC, ETH. */
  asset: string;
  /** Free value available. */
  free: string;
  /** Locked value, for example via staking or a limit order. */
  locked: string;
};

export const isBalance = (arg: unknown): arg is Balance => {
  if (typeof arg !== "object" || arg === null) return false;
  const { asset, free, locked } = arg as Partial<Balance>;
  return (
    typeof asset === "string" &&
    typeof free === "string" &&
    typeof locked === "string"
  );
};

export type BalanceChangeEvent = {
  timestamp: Timestamp;
  balances: Balance[];
};

export const isBalanceChangeEvent = (
  arg: unknown
): arg is BalanceChangeEvent => {
  if (typeof arg !== "object" || arg === null) return false;
  const { balances, timestamp } = arg as Partial<BalanceChangeEvent>;
  if (!isTimestamp(timestamp) || !Array.isArray(balances)) return false;
  return balances.every((balance) => isBalance(balance));
};
