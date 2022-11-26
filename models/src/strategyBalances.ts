import type { Day, DayInterval } from "@ggbot2/time";
import type { BalanceChangeEvent } from "./balanceChangeEvent.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";

export type ReadStrategyBalances = Operation<
  AccountStrategyKey & DayInterval,
  { day: Day; data: BalanceChangeEvent[] }[]
>;
