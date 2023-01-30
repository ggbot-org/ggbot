import { arrayTypeGuard } from "@ggbot2/type-utils";
import { AccountKey } from "./account.js";
import {
  AccountStrategy,
  AccountStrategyKey,
  isAccountStrategy,
} from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { StrategyScheduling } from "./strategyScheduling.js";
import { CreationTime, DeletionTime, UpdateTime } from "./time.js";

export const isAccountStrategies =
  arrayTypeGuard<AccountStrategy>(isAccountStrategy);

export type ReadAccountStrategies = Operation<
  AccountKey,
  AccountStrategy[] | null
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
