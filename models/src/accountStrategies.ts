import { arrayTypeGuard } from "@ggbot2/type-utils";
import type { AccountKey } from "./account.js";
import {
  AccountStrategy,
  AccountStrategyKey,
  isAccountStrategy,
} from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import type { StrategyScheduling } from "./strategyScheduling.js";
import type { CreationTime, DeletionTime, UpdateTime } from "./time.js";

export type AccountStrategies = AccountStrategy[];

export const isAccountStrategies =
  arrayTypeGuard<AccountStrategy>(isAccountStrategy);

export type ReadAccountStrategies = Operation<
  AccountKey,
  AccountStrategies | null
>;

export type InsertAccountStrategiesItem = Operation<
  AccountKey & { item: AccountStrategy },
  CreationTime
>;

export type UpdateAccountStrategiesItem = Operation<
  AccountStrategyKey & {
    changes: Partial<Pick<AccountStrategy, "name" | "schedulings">>;
  },
  UpdateTime
>;

/** Update accountStrategy, add new scheduling. */
export type CreateAccountStrategiesItemScheduling = Operation<
  AccountStrategyKey & Pick<StrategyScheduling, "frequency">,
  UpdateTime
>;

/** Update accountStrategy, remove all schedulings. */
export type RemoveAccountStrategiesItemSchedulings = Operation<
  AccountStrategyKey,
  UpdateTime
>;

export type DeleteAccountStrategiesItem = Operation<
  AccountStrategyKey,
  DeletionTime
>;

export type SuspendAccountStrategiesSchedulings = Operation<
  AccountKey,
  UpdateTime
>;
