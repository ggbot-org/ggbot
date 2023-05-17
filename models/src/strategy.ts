import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";

import { Account, AccountKey, isAccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { isItemId, Item, newId, NewItem } from "./item.js";
import { isName, Name, normalizeName } from "./name.js";
import { Operation } from "./operation.js";
import { createdNow, CreationTime, DeletionTime, UpdateTime } from "./time.js";

export const strategyKinds = ["binance"] as const;
export type StrategyKind = (typeof strategyKinds)[number];
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
}: NewItem<Strategy>): Strategy => ({
  ...createdNow(),
  id: newId(),
  accountId,
  kind,
  name: normalizeName(name),
});

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

export const isCopyStrategyInput = objectTypeGuard<CopyStrategy["in"]>(
  ({ name, ...accountStrategyKey }) =>
    isAccountStrategyKey(accountStrategyKey) && isName(name)
);

export type CreateStrategy = Operation<NewItem<Strategy>, Strategy>;

export const isCreateStrategyInput = objectTypeGuard<CreateStrategy["in"]>(
  ({ name, kind, ...accountKey }) =>
    isAccountKey(accountKey) && isName(name) && isStrategyKind(kind)
);

/**
 * Input `StrategyKey` has `strategyKind` and maybe truncated `strategyId`.
 *
 * @example Get all strategies with strategyId starting with 'a'.
 *
 * ```json
 * {
 *   "strategyKind": "binance",
 *   "strategyId": "a"
 * }
 * ```
 */
export type ListStrategyKeys = Operation<
  Pick<StrategyKey, "strategyKind"> & {
    strategyId: string;
  },
  StrategyKey[]
>;

export type ReadStrategy = Operation<StrategyKey, Strategy | null>;

export const isReadStrategyInput = objectTypeGuard<ReadStrategy["in"]>(
  (strategyKey) => isStrategyKey(strategyKey)
);

export type ReadStrategyAccountId = Operation<StrategyKey, Account["id"]>;

export type RenameStrategy = Operation<
  AccountStrategyKey & Pick<Strategy, "name">,
  UpdateTime
>;

export const isRenameStrategyInput = objectTypeGuard<RenameStrategy["in"]>(
  ({ name, ...accountStrategyKey }) =>
    isName(name) && isAccountStrategyKey(accountStrategyKey)
);

export type DeleteStrategy = Operation<AccountStrategyKey, DeletionTime>;

export const isDeleteStrategyInput = objectTypeGuard<DeleteStrategy["in"]>(
  (accountStrategyKey) => isAccountStrategyKey(accountStrategyKey)
);
