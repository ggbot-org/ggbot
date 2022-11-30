import { Account, AccountKey, isAccountKey } from "./account.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import { Item, isItemId, NewItem, newId } from "./item.js";
import { isLiteralType } from "./literalType.js";
import { Name, isName, normalizeName } from "./name.js";
import { objectTypeGuard } from "./objects.js";
import type { Operation } from "./operation.js";
import { CreationTime, DeletionTime, UpdateTime, createdNow } from "./time.js";

export const strategyKinds = ["binance"] as const;
export type StrategyKind = typeof strategyKinds[number];
export const isStrategyKind = isLiteralType<StrategyKind>(strategyKinds);

export type Strategy = Item &
  CreationTime &
  AccountKey & {
    readonly kind: StrategyKind;
    name: Name;
  };

export const isStrategy = objectTypeGuard<Strategy>(
  ({ id, name, kind, ...accountKey }) =>
    isItemId(id) &&
    isAccountKey(accountKey) &&
    isStrategyKind(kind) &&
    isName(name)
);

export const newStrategy = ({
  accountId,
  kind,
  name,
}: NewItem<Strategy>): Strategy => {
  return {
    ...createdNow(),
    id: newId(),
    accountId,
    kind,
    name: normalizeName(name),
  };
};

export type StrategyKey = Readonly<{
  strategyId: Strategy["id"];
  strategyKind: Strategy["kind"];
}>;

export const isStrategyKey = objectTypeGuard<StrategyKey>(
  ({ strategyId, strategyKind }) =>
    isItemId(strategyId) && isStrategyKind(strategyKind)
);

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
