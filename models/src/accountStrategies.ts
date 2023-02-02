import { arrayTypeGuard } from "@ggbot2/type-utils";
import { AccountKey } from "./account.js";
import { AccountStrategy, AccountStrategyKey, isAccountStrategy } from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { CreationTime, DeletionTime, UpdateTime } from "./time.js";

export const isAccountStrategies = arrayTypeGuard<AccountStrategy>(isAccountStrategy);

export type ReadAccountStrategies = Operation<AccountKey, AccountStrategy[] | null>;

export type InsertAccountStrategiesItem = Operation<AccountKey & { item: AccountStrategy }, CreationTime>;

export type RenameAccountStrategiesItem = Operation<
  Omit<AccountStrategyKey, "strategyKind"> & Pick<AccountStrategy, "name">,
  UpdateTime
>;

export type WriteAccountStrategiesItemSchedulings = Operation<
  Omit<AccountStrategyKey, "strategyKind"> & Pick<AccountStrategy, "schedulings">,
  UpdateTime
>;

export type SuspendAccountStrategiesItemSchedulings = Operation<
  Omit<AccountStrategyKey, "strategyKind">,
  UpdateTime
>;

export type DeleteAccountStrategiesItem = Operation<Omit<AccountStrategyKey, "strategyKind">, DeletionTime>;

export type SuspendAccountStrategiesSchedulings = Operation<AccountKey, UpdateTime>;
