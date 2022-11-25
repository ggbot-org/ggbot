import { Account, AccountKey, isAccountKey } from "./account.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import { Item, isItemId, NewItem } from "./item.js";
import { isLiteralType } from "./literalType.js";
import { Name, isName } from "./name.js";
import type { Operation } from "./operation.js";
import type { CreationTime, DeletionTime, UpdateTime } from "./time.js";

export const strategyKinds = ["binance"] as const;
export type StrategyKind = typeof strategyKinds[number];
export const isStrategyKind = isLiteralType<StrategyKind>(strategyKinds);

export type Strategy = Item &
  CreationTime &
  AccountKey & {
    readonly kind: StrategyKind;
    name: Name;
  };

export const isStrategy = (arg: unknown): arg is StrategyKind => {
  if (typeof arg !== "object" || arg === null) return false;
  const { accountId, id, kind, name } = arg as Partial<Strategy>;
  return (
    isItemId(id) &&
    isAccountKey({ accountId }) &&
    isStrategyKind(kind) &&
    isName(name)
  );
};

export type StrategyKey = Readonly<{
  strategyId: Strategy["id"];
  strategyKind: Strategy["kind"];
}>;

export const isStrategyKey = (arg: unknown): arg is StrategyKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { strategyId, strategyKind } = arg as Partial<StrategyKey>;
  return isItemId(strategyId) && isStrategyKind(strategyKind);
};

export type CopyStrategy = Operation<
  AccountStrategyKey & Pick<Strategy, "name">,
  Strategy
>;

export type CreateStrategy = Operation<NewItem<Strategy>, Strategy>;

/** Input `StrategyKey` has `strategyKind` and maybe truncated `strategyId`.
@example
Get all strategies with strategyId starting with 'a'.
```json
{
  "strategyKind": "binance",
  "strategyId": "a"
}
``` */
export type ListStrategyKeys = Operation<
  Pick<StrategyKey, "strategyKind"> & {
    strategyId: string;
  },
  StrategyKey[]
>;

export type ReadStrategy = Operation<StrategyKey, Strategy | null>;

export type ReadStrategyAccountId = Operation<StrategyKey, Account["id"]>;

export type RenameStrategy = Operation<
  AccountStrategyKey & Pick<Strategy, "name">,
  UpdateTime
>;

export type DeleteStrategy = Operation<AccountStrategyKey, DeletionTime>;
