import { DayInterval } from "@ggbot2/time";
import { Operation } from "./operation.js";
import { AccountStrategyKey } from "./accountStrategy.js";
import { StrategyDailyOrders } from "./strategyDailyOrders.js";

export type ReadStrategyOrders = Operation<
  AccountStrategyKey & DayInterval,
  StrategyDailyOrders
>;
