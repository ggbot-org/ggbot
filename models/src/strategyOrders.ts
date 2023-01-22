import type { DayInterval } from "@ggbot2/time";
import type { Operation } from "./operation.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import type { StrategyDailyOrders } from "./strategyDailyOrders.js";

export type ReadStrategyOrders = Operation<
  AccountStrategyKey & DayInterval,
  StrategyDailyOrders
>;
